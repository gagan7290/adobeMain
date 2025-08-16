
import styles from "./Workspace.module.css"
import UploadPdf from "../uploadPdfComponent/UploadPdf"
import UploadedFilesContainer from "../../uploadedFiles/UploadedFilesContainer"
export default function Workspace(){
    return (
           <div className={styles.workSpace}>
                <div className={styles.workSpaceTitle}>
                    Workspace
                </div>
                <UploadPdf/>
                <UploadedFilesContainer/>
           </div>
    )
}