"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Users,
  Clock,
  Tag,
  Share2,
  Bookmark,
  Flag,
  Award,
  Check,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RichTextEditor } from "@/components/QAContent"
import { RichContent } from "@/components/QAContent"
import { Separator } from "@/components/ui/separator"
import Logo from "@/components/Logo"
import QAService, { type QuestionDetails } from "@/services/qa.service"
import AuthService from "@/services/auth.service"
import NotificationService from "@/components/Notification"
import { db } from "@/lib/firebase"
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore"

export default function QADetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // State for data
  const [questionData, setQuestionData] = useState<QuestionDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [questionVote, setQuestionVote] = useState(0) // User's current vote: -1, 0, or 1
  const [answerVotes, setAnswerVotes] = useState<{ [key: string]: number }>({})
  const [votingLoading, setVotingLoading] = useState<{ [key: string]: boolean }>({})

  const [newAnswer, setNewAnswer] = useState("")
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarking, setBookmarking] = useState(false)

  const fetchUserVotes = async (questionId: string, answerIds: string[]) => {
    const userId = AuthService.getAuthenticatedUserId()
    if (!userId) return

    try {
      // Fetch question vote
      const questionVotesCollection = collection(db, "questionVotes")
      const questionVoteQuery = query(
        questionVotesCollection,
        where("userId", "==", userId),
        where("questionId", "==", questionId),
      )
      const questionVoteSnapshot = await getDocs(questionVoteQuery)

      if (!questionVoteSnapshot.empty) {
        const voteData = questionVoteSnapshot.docs[0].data()
        setQuestionVote(voteData.voteType === "up" ? 1 : -1)
      }

      // Fetch answer votes
      const answerVotesCollection = collection(db, "answerVotes")
      const answerVoteQuery = query(
        answerVotesCollection,
        where("userId", "==", userId),
        where("answerId", "in", answerIds.length > 0 ? answerIds : ["dummy"]),
      )
      const answerVoteSnapshot = await getDocs(answerVoteQuery)

      const userAnswerVotes: { [key: string]: number } = {}
      answerVoteSnapshot.docs.forEach((doc) => {
        const voteData = doc.data()
        userAnswerVotes[voteData.answerId] = voteData.voteType === "up" ? 1 : -1
      })
      setAnswerVotes(userAnswerVotes)
    } catch (error) {
      console.error("Error fetching user votes:", error)
    }
  }

  // Fetch question and answers on component mount
  useEffect(() => {
    const fetchQuestionData = async () => {
      if (!id) {
        setError("Question ID not provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await QAService.fetchQuestionWithAnswers(id)

        if (!data) {
          setError("Question not found")
        } else {
          setQuestionData(data)
          const bookMark = await QAService.isAlreadyBookmarked(id)
          setIsBookmarked(bookMark)

          const answerIds = data.answers.map((answer) => answer.id)
          await fetchUserVotes(id, answerIds)

          // Optionally increment view count
          await QAService.incrementQuestionViews(id)
        }
      } catch (err) {
        console.error("Error fetching question:", err)
        setError("Failed to load question")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionData()
  }, [id])

  const handleQuestionVote = async (direction: "up" | "down") => {
    const userId = AuthService.getAuthenticatedUserId()
    if (!userId) {
      NotificationService.error("Authentication Required", "You must be logged in to vote.")
      navigate("/login")
      return
    }

    if (!questionData) return

    const voteKey = `question-${questionData.question.id}`
    if (votingLoading[voteKey]) return

    setVotingLoading((prev) => ({ ...prev, [voteKey]: true }))

    try {
      const newVoteValue = direction === "up" ? 1 : -1
      const isRemovingVote = questionVote === newVoteValue

      // Check for existing vote
      const questionVotesCollection = collection(db, "questionVotes")
      const existingVoteQuery = query(
        questionVotesCollection,
        where("userId", "==", userId),
        where("questionId", "==", questionData.question.id),
      )
      const existingVoteSnapshot = await getDocs(existingVoteQuery)

      if (!existingVoteSnapshot.empty) {
        // Remove existing vote
        const existingVoteDoc = existingVoteSnapshot.docs[0]
        const existingVoteData = existingVoteDoc.data()
        const existingVoteValue = existingVoteData.voteType === "up" ? 1 : -1

        await deleteDoc(doc(db, "questionVotes", existingVoteDoc.id))

        // Update question vote count
        const questionRef = doc(db, "questions", questionData.question.id)
        await updateDoc(questionRef, {
          votes: increment(-existingVoteValue),
        })
      }

      if (!isRemovingVote) {
        // Add new vote
        await addDoc(questionVotesCollection, {
          userId,
          questionId: questionData.question.id,
          voteType: direction,
          createdAt: serverTimestamp(),
        })

        // Update question vote count
        const questionRef = doc(db, "questions", questionData.question.id)
        await updateDoc(questionRef, {
          votes: increment(newVoteValue),
        })

        setQuestionVote(newVoteValue)
      } else {
        setQuestionVote(0)
      }

      // Refresh question data to show updated vote count
      const updatedData = await QAService.fetchQuestionWithAnswers(questionData.question.id)
      if (updatedData) {
        setQuestionData(updatedData)
      }
    } catch (error) {
      console.error("Error voting on question:", error)
      NotificationService.error("Voting Failed", "Failed to register your vote. Please try again.")
    } finally {
      setVotingLoading((prev) => ({ ...prev, [voteKey]: false }))
    }
  }

  const handleAnswerVote = async (answerId: string, direction: "up" | "down") => {
    const userId = AuthService.getAuthenticatedUserId()
    if (!userId) {
      NotificationService.error("Authentication Required", "You must be logged in to vote.")
      navigate("/login")
      return
    }

    const voteKey = `answer-${answerId}`
    if (votingLoading[voteKey]) return

    setVotingLoading((prev) => ({ ...prev, [voteKey]: true }))

    try {
      const newVoteValue = direction === "up" ? 1 : -1
      const currentVote = answerVotes[answerId] || 0
      const isRemovingVote = currentVote === newVoteValue

      // Check for existing vote
      const answerVotesCollection = collection(db, "answerVotes")
      const existingVoteQuery = query(
        answerVotesCollection,
        where("userId", "==", userId),
        where("answerId", "==", answerId),
      )
      const existingVoteSnapshot = await getDocs(existingVoteQuery)

      if (!existingVoteSnapshot.empty) {
        // Remove existing vote
        const existingVoteDoc = existingVoteSnapshot.docs[0]
        const existingVoteData = existingVoteDoc.data()
        const existingVoteValue = existingVoteData.voteType === "up" ? 1 : -1

        await deleteDoc(doc(db, "answerVotes", existingVoteDoc.id))

        // Update answer vote count
        const answerRef = doc(db, "answers", answerId)
        await updateDoc(answerRef, {
          votes: increment(-existingVoteValue),
        })
      }

      if (!isRemovingVote) {
        // Add new vote
        await addDoc(answerVotesCollection, {
          userId,
          answerId,
          voteType: direction,
          createdAt: serverTimestamp(),
        })

        // Update answer vote count
        const answerRef = doc(db, "answers", answerId)
        await updateDoc(answerRef, {
          votes: increment(newVoteValue),
        })

        setAnswerVotes((prev) => ({ ...prev, [answerId]: newVoteValue }))
      } else {
        setAnswerVotes((prev) => ({ ...prev, [answerId]: 0 }))
      }

      // Refresh question data to show updated vote count
      if (questionData) {
        const updatedData = await QAService.fetchQuestionWithAnswers(questionData.question.id)
        if (updatedData) {
          setQuestionData(updatedData)
        }
      }
    } catch (error) {
      console.error("Error voting on answer:", error)
      NotificationService.error("Voting Failed", "Failed to register your vote. Please try again.")
    } finally {
      setVotingLoading((prev) => ({ ...prev, [voteKey]: false }))
    }
  }

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim() || !questionData) return
    const userId = AuthService.getAuthenticatedUserId()
    if (!userId) {
      NotificationService.error("Authentication Required", "You must be logged in to post a question.")
      navigate("/login")
      return
    }

    const userData = AuthService.getAuthenticatedUserData()
    console.log("UserData: ", userData)

    try {
      const answerData = {
        questionId: questionData.question.id,
        content: newAnswer,
        author: {
          name: userData.name, // Replace with actual user data
          avatar: userData.profilePicture || "",
          reputation: 0,
          badges: [],
          userId: userId,
        },
        votes: 0,
        isAccepted: false,
      }

      await QAService.addAnswer(answerData)

      // Refresh the data to show the new answer
      const updatedData = await QAService.fetchQuestionWithAnswers(id!)
      setQuestionData(updatedData)
      setNewAnswer("")
    } catch (err) {
      console.error("Error submitting answer:", err)
      // Handle error (show toast, etc.)
      NotificationService.error("Error Answering the Questions", `${err}`)
    }
  }

  const handleSubmitBookmark = async () => {
    setBookmarking(true)
    const userId = AuthService.getAuthenticatedUserId()
    if (!userId) {
      NotificationService.error("Authentication Required", "You must be logged in to bookmark a question.")
      navigate("/login")
      return
    }

    if (isBookmarked) {
      await QAService.removeBookmarkQuestion(id!).then(() => {
        setIsBookmarked(false)
        setBookmarking(false)
        NotificationService.success("Removed Bookmark", "Successfully Removed your bookmarked question")
      })
    } else {
      await QAService.bookmarkQuestion(id!, questionData?.question.title || "").then(() => {
        setIsBookmarked(true)
        setBookmarking(false)
        NotificationService.success("Added Bookmark", "Successfully Added your bookmarked question")
      })
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-18 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading question...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !questionData) {
    return (
      <div className="min-h-screen bg-background pt-18 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Question Not Found</h1>
          <p className="text-muted-foreground mb-4 font-light italic">
            {error || "The question you're looking for doesn't exist."}
          </p>
          <Button className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer" onClick={() => navigate("/qa")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Button>
        </div>
      </div>
    )
  }

  const { question, answers } = questionData

  return (
    <div className="min-h-screen bg-background pt-18">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <Button onClick={() => navigate("/qa")} variant="ghost" className="cursor-pointer" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Back to Questions</span>
                <span className="xs:hidden">Back</span>
              </Button>
              <div className="h-6 w-px bg-border" />
              <Logo logoOnly />
              <span className="text-xl sm:text-3xl font-light">Q&A</span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
              <Button
                className="cursor-pointer flex-shrink-0 bg-transparent"
                variant="outline"
                size="sm"
                onClick={() => {
                  const url = window.location.href
                  navigator.clipboard
                    .writeText(url)
                    .then(() => {
                      NotificationService.success("Link Copied", "Question link has been copied to clipboard")
                    })
                    .catch(() => {
                      // Fallback for older browsers
                      const textArea = document.createElement("textarea")
                      textArea.value = url
                      document.body.appendChild(textArea)
                      textArea.select()
                      document.execCommand("copy")
                      document.body.removeChild(textArea)
                      NotificationService.success("Link Copied", "Question link has been copied to clipboard")
                    })
                }}
              >
                <Share2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button
                disabled={bookmarking}
                variant="outline"
                size="sm"
                onClick={() => {
                  handleSubmitBookmark()
                }}
                className={`flex-shrink-0 ${isBookmarked ? "text-primary" : ""}`}
              >
                <Bookmark className="h-4 w-4 sm:mr-2" fill={isBookmarked ? "currentColor" : "none"} />
                <span className="hidden sm:inline">{isBookmarked ? "Saved" : "Save"}</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                <Flag className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Report</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Question Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Vote Section */}
                <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-1 h-8 w-8 ${questionVote === 1 ? "text-primary bg-primary/10" : ""}`}
                    onClick={() => handleQuestionVote("up")}
                    disabled={votingLoading[`question-${question.id}`]}
                  >
                    {votingLoading[`question-${question.id}`] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronUp className="h-5 w-5" />
                    )}
                  </Button>
                  <span className="font-bold text-xl">{question.votes}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-1 h-8 w-8 ${questionVote === -1 ? "text-destructive bg-destructive/10" : ""}`}
                    onClick={() => handleQuestionVote("down")}
                    disabled={votingLoading[`question-${question.id}`]}
                  >
                    {votingLoading[`question-${question.id}`] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                {/* Question Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-2xl font-bold text-foreground">{question.title}</h1>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Asked {question.createdAt}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Viewed {question.views} times</span>
                    </div>
                  </div>

                  <div className="mb-6 overflow-hidden">
                    <div className="prose prose-sm max-w-none break-words overflow-wrap-anywhere">
                      <RichContent content={question.content} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {question.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{question.author.name}</span>
                          <span className="text-sm text-muted-foreground">({question.author.reputation})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {question.author.badges.map((badge) => (
                            <Badge key={badge} variant="outline" className="text-xs">
                              <Award className="h-3 w-3 mr-1" />
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">Joined {question.author.joinedDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Answers Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{answers.length} Answers</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Button variant="ghost" size="sm">
                  Votes
                </Button>
                <Button variant="ghost" size="sm">
                  Newest
                </Button>
                <Button variant="ghost" size="sm">
                  Oldest
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {answers.map((answer) => (
                <Card key={answer.id} className={`${answer.isAccepted ? "ring-2 ring-green-200 bg-green-50/50" : ""}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-1 h-8 w-8 ${(answerVotes[answer.id] || 0) === 1 ? "text-primary bg-primary/10" : ""}`}
                          onClick={() => handleAnswerVote(answer.id, "up")}
                          disabled={votingLoading[`answer-${answer.id}`]}
                        >
                          {votingLoading[`answer-${answer.id}`] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ChevronUp className="h-5 w-5" />
                          )}
                        </Button>
                        <span className="font-bold text-lg">{answer.votes}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-1 h-8 w-8 ${(answerVotes[answer.id] || 0) === -1 ? "text-destructive bg-destructive/10" : ""}`}
                          onClick={() => handleAnswerVote(answer.id, "down")}
                          disabled={votingLoading[`answer-${answer.id}`]}
                        >
                          {votingLoading[`answer-${answer.id}`] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </Button>
                        {answer.isAccepted && (
                          <div className="mt-2 p-2 bg-green-100 rounded-full">
                            <Check className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                      </div>

                      {/* Answer Content */}
                      <div className="flex-1">
                        {answer.isAccepted && (
                          <div className="flex items-center space-x-2 mb-4">
                            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Accepted Answer
                            </Badge>
                          </div>
                        )}

                        <div className="mb-6">
                          <RichContent content={answer.content} />
                        </div>

                        {/* Answer Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-muted-foreground">Answered {answer.createdAt}</span>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={answer.author.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {answer.author.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-sm">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{answer.author.name}</span>
                                  <span className="text-muted-foreground">({answer.author.reputation})</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  {answer.author.badges.map((badge) => (
                                    <Badge key={badge} variant="outline" className="text-xs">
                                      {badge}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Your Answer</h3>
              <p className="text-sm text-muted-foreground">
                Use the formatting toolbar to add code blocks, images, and rich text formatting to your answer.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <RichTextEditor
                value={newAnswer}
                onChange={setNewAnswer}
                placeholder="Write your answer here... You can use Markdown formatting, code blocks, and more!"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Supports Markdown, code blocks, and image embedding</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" className="cursor-pointer bg-transparent">
                    Save Draft
                  </Button>
                  <Button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
                    onClick={handleSubmitAnswer}
                    disabled={!newAnswer.trim()}
                  >
                    Post Your Answer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
