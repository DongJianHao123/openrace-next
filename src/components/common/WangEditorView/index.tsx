import { Utils } from '@/utils'
import './view.css'

interface IProps {
    value: string
    className?: string
    style?: React.CSSProperties
}

const WangEditorView = (props: IProps) => {
    const cleanHtml = Utils.richText.extractTextFromHtml(props.value);
    return <div className={`editor-content-view ${props.className}`} style={props.style} dangerouslySetInnerHTML={{ __html: cleanHtml }}></div>
}

export default WangEditorView;