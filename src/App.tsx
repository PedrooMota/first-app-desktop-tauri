import { useState } from "react"
import { emit } from '@tauri-apps/api/event'
import { ArrowUpToLine, ClipboardCopy, FileInput, History, X } from "lucide-react"

import { useDropzone } from "react-dropzone"

import { MenuItem } from "./components/menu-item"
import { ProgressBar } from "./components/progress-bar"
import { Separator } from "./components/separator"

function App() {

  const [uploadQueue, setUploadQueue] = useState<File[]>([])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
  } = useDropzone({
    onDrop: handleStartUpload,
    multiple: true,
    noClick: true,
    noKeyboard: true
  })

  function emitUploadProgress(progress: number) {
    emit('progress', {
      progress,
    })
  }

  function handleStartUpload(files: File[]) {
    setUploadQueue(files)

    setTimeout(() => { emitUploadProgress(10) }, 500 * 1)
    setTimeout(() => { emitUploadProgress(20) }, 500 * 2)
    setTimeout(() => { emitUploadProgress(30) }, 500 * 3)
    setTimeout(() => { emitUploadProgress(40) }, 500 * 4)
    setTimeout(() => { emitUploadProgress(50) }, 500 * 5)
    setTimeout(() => { emitUploadProgress(60) }, 500 * 6)
    setTimeout(() => { emitUploadProgress(70) }, 500 * 7)
    setTimeout(() => { emitUploadProgress(80) }, 500 * 8)
    setTimeout(() => { emitUploadProgress(90) }, 500 * 9)
    setTimeout(() => { emitUploadProgress(100) }, 500 * 10)
  }

  function handleCancelUpload() {
    setUploadQueue([])
  }

  function handleQuitApp() {
    emit('quit')
  }

  const status = uploadQueue.length > 0 ? 'accept'
  : isDragActive ? 'active'
  : 'pending'
 
  return (
    <div className="space-y-1 bg-zinc-800">
      <div 
        {...getRootProps()}
        data-status={status}
        className="text-white/80 n-4 px-4 h-24 flex items-center border border-dashed rounded justify-center data-[status=accept]"
      >
        <input {...getInputProps()} />

        { status === 'active' && 'Start upload...' }

        { status === 'accept' && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              {uploadQueue.length > 1 ? (
                <p className="animate-pulse">
                  Uploading { uploadQueue.length } file(s)...
                </p>
              ) : (
                <p className="animate-pulse">
                  Uploading { uploadQueue[0].name.length > 14
                    ? uploadQueue[0].name.substring(0, 14).concat(' ... ')
                    : uploadQueue[0].name}
                </p>
              )}

              <button onClick={handleCancelUpload} title="Cancel upload" className="text-red">
                  <X className="w-3 h-3" />
              </button>
            </div>

            <ProgressBar progress={40} />
          </div>
        ) }

        { status === 'pending' && (
          <div className="flex items-center gap-2">
            <ArrowUpToLine className="h-3 w-3 stroke-[1.5px]" />
            <p>Drag files here...</p>
          </div>
        ) }
      </div>

      <Separator />

      <nav className="px-1.5">
          <MenuItem onClick={open} hotkey="mod+o">
            <FileInput className="w-4 h-4 stroke-[1.5px]" />
            Select File
          </MenuItem>

          <MenuItem hotkey="mod+shift+v">
            <ClipboardCopy className="w-4 h-4 stroke-[1.5px]" />
            Upload from clipboard
          </MenuItem>

          <MenuItem hotkey="mod+y">
            <History className="w-4 h-4 stroke-[1.5px]" />
            Recent uploads
          </MenuItem>
      </nav>

      <Separator />

      <nav className="px-1.5">
          <MenuItem className="py-1">
            About teste...
          </MenuItem>

          <MenuItem className="py-1">
            Check for updates
          </MenuItem>
      </nav>

      <Separator />

      <nav className="px-1.5">
          <MenuItem className="py-1" hotkey="mod+/">
            Settings
          </MenuItem>

          <MenuItem onClick={handleQuitApp} className="py-1" hotkey="mod+q">
            Quit
          </MenuItem>
      </nav>
    </div>
  )
}

export default App
