"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Check, X, Building2, Calendar, Globe, Mail, ArrowLeft } from "lucide-react"
import { DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Link } from "react-router-dom";
import type { CompanyPendingRequestDto } from "@/services/companies-pending.service"
import CompaniesPendingService from "@/services/companies-pending.service"
import NotificationService from "@/components/Notification"

export default function Request() {
    const [pendingRequests, setPendingRequest] = useState<CompanyPendingRequestDto[]>([]);
    const [searchTerm, setSearchTerm] = useState("")
    const filteredRequests = pendingRequests.filter((request) => {
        const matchesSearch =
            request.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.workEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.website.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })
    // State Management
    const [isLoading, setIsLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchPendingRequestsData = async () => {
        setIsLoading(true)
        const data = await CompaniesPendingService.getCompaniesPending();
        console.log("Response Data: ", data)
        setPendingRequest(data);
        setIsLoading(false)
    }
    useEffect(() => {

        fetchPendingRequestsData();
    }, [])

    const handleApprove = async (id: number) => {
        setActionLoading(true)
        const approved = await CompaniesPendingService.sendApproved(id)
        if (approved) {
            fetchPendingRequestsData();
            NotificationService.success("Company Approved!", "Successfully Aproved an Company");
        } else {
            console.error("Error Rejecting:", approved);
            NotificationService.error("Approving Failed!", "Failed to Aproved an Company");
        }
        setActionLoading(false);
    }

    const handleReject = async (id: number) => {
        setActionLoading(true);
        const rejected = await CompaniesPendingService.sendReject(id)
        if (rejected) {
            fetchPendingRequestsData();
            NotificationService.success("Company Rejected!", "Successfully Reject an Company");
        } else {
            console.error("Error Rejecting:", rejected);
            NotificationService.error("Rejecting Failed!", "Failed to Reject an Company");
        }
        setActionLoading(false);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col space-y-4">
                    <Link to="/admin/dashboard">
                        <Button variant="outline" className="self-start">
                            <ArrowLeft />
                            Go Back
                        </Button>
                    </Link>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-500 rounded-lg">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Company Requests</h1>
                            <p className="text-gray-600 dark:text-gray-300">Review and approve pending company applications</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Building2 className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Pending Requests</p>
                                        <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Check className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Approved Today</p>
                                        <p className="text-2xl font-bold text-gray-900">12</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <X className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Rejected Today</p>
                                        <p className="text-2xl font-bold text-gray-900">3</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="">
                        <h1 className="font-bold mb-2 text-3xl">Search</h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search companies, emails, or websites..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle>Pending Requests ({filteredRequests.length})</CardTitle>
                        <CardDescription>Companies waiting for approval</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Company Name</TableHead>
                                        <TableHead>Work Email</TableHead>
                                        <TableHead>Website</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        // Loading placeholder rows
                                        Array.from({ length: 5 }).map((_, index) => (
                                            <TableRow key={`loading-${index}`}>
                                                <TableCell>
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                                                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredRequests.length === 0 ? (
                                        // Empty state message
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                <div className="flex flex-col items-center space-y-3">
                                                    <Building2 className="h-12 w-12 text-gray-400" />
                                                    <div>
                                                        <p className="text-lg font-medium text-gray-900 dark:text-white">No pending requests found</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {searchTerm ? "Try adjusting your search criteria" : "All company requests have been processed"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        // Display data normally
                                        filteredRequests.map((request) => (
                                            <TableRow key={request.id} className="hover:bg-gray-50/50">
                                                <TableCell>
                                                    <span className="font-mono text-sm text-gray-600"># {request.id}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <Building2 className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <span className="font-medium text-gray-900">{request.companyName}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Mail className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">{request.workEmail}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Globe className="h-4 w-4 text-gray-400" />
                                                        <a
                                                            href={request.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:underline"
                                                        >
                                                            {request.website}
                                                        </a>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {new Date(request.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    disabled={actionLoading}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Approve Company Request</DialogTitle>
                                                                    <DialogDescription>
                                                                        Are you sure you want to approve the request for {request.companyName}? This action cannot be undone.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline">Cancel</Button>
                                                                    </DialogClose>
                                                                    <DialogClose asChild>
                                                                        <Button
                                                                            onClick={() => handleApprove(request.id)}
                                                                            className="bg-green-600 hover:bg-green-700"
                                                                        >
                                                                            Approve
                                                                        </Button>
                                                                    </DialogClose>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    disabled={actionLoading}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Reject Company Request</DialogTitle>
                                                                    <DialogDescription>
                                                                        Are you sure you want to reject the request for {request.companyName}? This action cannot be undone.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline">Cancel</Button>
                                                                    </DialogClose>
                                                                    <DialogClose asChild>
                                                                        <Button
                                                                            onClick={() => handleReject(request.id)}
                                                                            className="bg-red-600 hover:bg-red-700"
                                                                        >
                                                                            Reject
                                                                        </Button>
                                                                    </DialogClose>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
