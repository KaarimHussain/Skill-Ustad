// src/lib/nodeTypes.ts
import { memo } from 'react';
import StartNode from '@/components/nodes/StartNode';
import CourseNode from '@/components/nodes/CourseNode';
import type { NodeTypes } from 'reactflow';

// Ensure custom components are memoized
const MemoizedStartNode = memo(StartNode);
const MemoizedCourseNode = memo(CourseNode);

export const nodeTypes: NodeTypes = {
    start: MemoizedStartNode,
    course: MemoizedCourseNode,
    milestone: MemoizedCourseNode,
    project: MemoizedCourseNode,
    end: MemoizedCourseNode,
};