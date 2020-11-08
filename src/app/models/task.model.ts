export interface TaskModel {
    _id?: string;
    ownerId: string;
    title: string;
    content: string;
    order: number;
    color: string;
    pinned?: boolean;
    tags: string[];
}