import UploadedFile from "./UploadedFile"
import styles from "./UploadedFilesContainer.module.css"


export default function UploadedFilesContainer(){
    return (
        <div className={styles.uploadedFilesContainer}>
            {Array(20).fill(0).map(item => <UploadedFile cover={item}/>)}
        </div>
    )
}