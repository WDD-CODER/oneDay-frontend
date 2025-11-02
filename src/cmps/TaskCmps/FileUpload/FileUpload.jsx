import { useRef, useState } from "react";
import { FloatingContainerCmp } from "../../FloatingContainerCmp";
import { FileUploadActionMenu } from "./FileUploadActionMenu";
import { makeId, toBase64 } from "../../../services/util.service";
import { storageService } from "../../../services/async-storage.service";
import { FilePreview } from "./filePreview";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { FullScreenContainer } from "./FullScreenContainer";
import { onSetPopUp } from "../../../store/actions/system.actions";
import { SvgIcon } from "../../SvgIcon";
import { ExistingMembers } from "../MembersCmp/ExistingMembers";

export function FileUpload({ info, onUpdate }) {
    const { taskFiles } = info

    const floating = useSelector(state => state.systemModule.floating)

    const [isFullScreenOpen, setIsFullScreenOpen] = useState(false)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const addFileRef = useRef(null)
    const previewRef = useRef(null)
    const hoverRef = useRef(null)
    const [addFileAnchor, setAddFileAnchor] = useState(null)
    const fileInputRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false);
    const dragDataType = 'drag files here'
    const taskFileToShow = taskFiles ? taskFiles : []


    function onToggleMenu(ev) {

        setAddFileAnchor(ev.currentTarget)
        setIsMenuOpen(prev => !prev)
    }

    function addFromFolder() {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    async function handelFileChange(ev) {
        const file = ev.currentTarget.files[0]
        var fileItem = {}
        var filesToSave = []

        try {
            var base64 = await toBase64(file)

            fileItem = {
                title: file?.name,
                file: {
                    name: file?.name,
                    type: file?.type,
                    dataUrl: base64
                }
            }

        } catch (error) {
            console.log(' Problem uploading file to storage', error)
        }
        if (taskFiles) filesToSave = [...taskFiles, fileItem]
        else filesToSave = [fileItem]
        onUpdate(filesToSave)
    }

    function handleDragOver(ev) {
        ev.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(ev) {
        setIsDragging(false);
    }

    function handleDrop(ev) {
        ev.preventDefault();
        setIsDragging(false);

        const droppedFiles = ev.dataTransfer.files;

        if (droppedFiles.length > 0) {
            fileInputRef.current.files = droppedFiles;
            fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function closeMenu() {
        setIsMenuOpen(false)
    }

    function onRemoveFile() {
        let filesToSave = []
        onUpdate(filesToSave)
    }

    function clearHover() {
        clearTimeout(hoverRef.current)
        hoverRef.current = setTimeout(() => {
            setIsPreviewOpen(false)
        }, 300)
    }

    function onHoverFile() {
        if (isPreviewOpen) return setIsPreviewOpen(false)
        clearTimeout(hoverRef.current)
        setIsPreviewOpen(true)
    }


    function _onShowPopUp(ev) {
        if (!taskFileToShow.length) return
        ev.stopPropagation()
        setIsPreviewOpen(false)
        const content = <FullScreenContainer
            imgSrc={taskFileToShow[0]?.file?.dataUrl}
            imgTitle={taskFileToShow[0]?.file?.name}
        />
        onSetPopUp(content)
    }
    const files = [{
        imgUrl: taskFileToShow[0]?.file?.dataUrl,
        fullname: taskFileToShow[0]?.file?.name,
        id: makeId()
    }]
    const file = taskFileToShow[0]?.file ? files : false

    return (
        <div className={`file-upload ${isDragging ? 'dragging' : ''}`}
            onClick={onToggleMenu}
            ref={addFileRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>

            <input
                datatype="Drop Files Here"
                type="file"
                ref={fileInputRef}
                onChange={handelFileChange}
                style={{ display: 'none' }} />


            {isDragging && dragDataType}

            {!isDragging &&
                <section className={`empty-file-img-container ${!!taskFileToShow?.length}`}
                    ref={previewRef}
                    onMouseEnter={onHoverFile}
                    onMouseLeave={clearHover}>

                    <span className="round-plus-icon-container">
                        <span className="round-plus-icon"></span>
                    </span>
                    <img
                        className='empty-file-img' src={taskFileToShow[0]?.file?.dataUrl || "/img/emptyFile.svg"}
                        onClick={_onShowPopUp}
                        alt="Empty File Image" />

                </section>}


            {isMenuOpen && (
                <FloatingContainerCmp
                    anchorEl={addFileAnchor}
                    onClose={closeMenu}>

                    <div className="file-action-menu">
                        {taskFileToShow[0]?.file &&
                            <ExistingMembers type={'file-preview'} onRemove={onRemoveFile} members={file} />
                        }
                        <FileUploadActionMenu
                            addFromFolder={addFromFolder}
                            onCloseMenu={closeMenu} />
                    </div>
                </FloatingContainerCmp>
            )}


            {isPreviewOpen && !!taskFileToShow.length && (
                <FloatingContainerCmp
                    anchorEl={previewRef.current}
                    onClose={closeMenu}
                >
                    <div
                        onMouseEnter={() => clearTimeout(hoverRef.current)}
                        onMouseLeave={clearHover}>
                        <FilePreview
                            imgSrc={taskFileToShow[0]?.file?.dataUrl}
                            imgTitle={taskFileToShow[0]?.file?.name} />
                    </div>
                </FloatingContainerCmp>
            )}

        </div>
    )
}