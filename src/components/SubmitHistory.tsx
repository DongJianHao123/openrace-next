import { IProjectTeamRecord } from "@/types/projectTeam";
import { Utils } from "@/utils";
import { Empty } from "antd";
import { FileIcon, History, LinkIcon, TextIcon, UserIcon } from "lucide-react";

const SubmitHistory = ({ historys, isAdmin = false }: { historys: IProjectTeamRecord[], isAdmin?: boolean }) => (
    <div>
        <div className={`font-bold text-slate-800 mb-3 flex items-center ${isAdmin ? "text-sm mt-3" : "text-base"}`}>
            <History className="w-4 h-4 mr-2 text-green-600" /> 提交历史
        </div>
        <div className="pl-2">
            {
                historys.length === 0 && <Empty description={"暂无提交记录"} />
            }
            {historys.sort((a, b) => b.createTime - a.createTime).map((sub) => (
                <div key={sub.id} className="border-l-2 border-slate-200 pl-4 relative text-left py-3">
                    <div className={`w-2 h-2 rounded-full absolute -left-[5px] top-3 bg-green-500`}></div>
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-400">{Utils.date.format(sub.createTime)}</p>
                    </div>
                    <div className="mt-3 flex flex-col gap-4">
                        <p className="text-xs text-slate-500 flex items-start gap-1">
                            <UserIcon className="w-4 h-4" />
                            <span>提交人：</span>
                            <span className="flex-1 break-all word-break break-words font-bold">{sub.userName}</span>
                        </p>
                        <p className="text-xs text-slate-500 flex items-start gap-1">
                            <FileIcon className="w-4 h-4" />
                            <span>描述：</span>
                            <span className="flex-1 break-all word-break break-words">{sub.content}</span>
                        </p>
                        <p className="text-xs text-slate-500 flex items-start gap-1">
                            <LinkIcon className="w-4 h-4" />
                            <span>链接：</span>
                            {/* 超出换行 */}
                            <a
                                className="text-xs text-blue-500 flex-1 break-all word-break break-words hover:underline"
                                href={sub.file}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {sub.file}
                            </a>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default SubmitHistory;