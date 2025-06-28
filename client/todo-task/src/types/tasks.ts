export type TasksList = {
    _id: string,
    title: string,
    description: string
    status: string,
    createdAt: Date,
    updatedAt: Date 
}

export type TasksResponse ={

    TaskList: TasksList[] ,
    totalItems: number,
}


export type AddTaskResponse = {
    task: TasksList,
    message: string
}