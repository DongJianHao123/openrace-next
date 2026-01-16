export interface IMessage {
    content?: string;
    contentType?: number;
    createTime?: number;
    dealContent?: string;
    dealResult?: number;
    dealTime?: number;
    fromUserId?: number;
    images?: string;
    isDeal?: number;
    isRead?: number;
    limit?: number;
    messageId?: number;
    orderby?: string;
    page?: number;
    readTime?: number;
    startNum?: number;
    status?: number;
    thirdId?: number;
    title?: string;
    toUserId?: number;
    type?: number;

    teamName?: string;
    teamId?: number;

    fromUserName?: string;
    toUserName?: string;
}

export interface IDealMessageParams {
  dealContent?: string,
  dealResult: number,
  messageId: number
}