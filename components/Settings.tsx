import { Logo } from './Logo'

export const Settings = ({
  model,
  setModel,
  prompt,
  setPrompt,
  apiKey,
  setApiKey,
  setIsBrowserView,
}) => {
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value)
    localStorage.setItem('model', e.target.value)
  }

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value)
    localStorage.setItem('apiKey', e.target.value)
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
    localStorage.setItem('prompt', e.target.value)
  }

  return (
    <div className="relative mt-8 flex h-full w-full flex-col gap-8 overflow-y-auto overflow-x-hidden text-sm tracking-wide text-[#949494] [&::-webkit-scrollbar]:hidden">
      <div className="flex select-none items-center justify-center gap-2">
        <Logo className="h-12 w-12 text-white" />

        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-white">QuickCast</h1>
          <p className="font-medium">0.1.0</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full select-none items-center justify-center gap-2">
          <label className="max-w-[100px] flex-1 text-right text-xs font-medium">API Model:</label>
          <select
            className="flex-0 w-full max-w-xs rounded-[.35rem] border border-white/20 bg-white/5 px-1 py-0.5 text-[#DCDCDC] focus:outline-none"
            value={model}
            onChange={handleModelChange}
          >
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            <option value="gpt-4">gpt-4</option>
          </select>
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <label className="max-w-[100px] flex-1 select-none text-right text-xs font-medium">
            OpenAI API Key:
          </label>
          <input
            className="flex-0 w-full max-w-xs rounded-[.35rem] border border-white/20 bg-white/5 px-2 py-0.5 text-[#DCDCDC] focus:outline-none"
            type="text"
            value="sk-yourOwnOpenAiApiKeyHere"
          />
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <label className="max-w-[100px] flex-1 select-none text-right text-xs font-medium">
            Prompt:
          </label>
          <textarea
            className="flex-0 w-full max-w-xs rounded-[.35rem] border border-white/20 bg-white/5 px-2 py-0.5 text-[#DCDCDC] focus:outline-none"
            value={prompt}
            onChange={handlePromptChange}
            rows={2}
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 px-16 text-[#ADADAD]">
        <div className="flex items-center justify-center gap-3">
          <a
            className="cursor-default select-none rounded-[.35rem] bg-[#3D3D3D] px-2 py-0.5 text-[#DCDCDC] focus:outline-none"
            href="https://twitter.com/_patrickpc"
            target="_blank"
          >
            Send Feedback
          </a>
          <a
            className="cursor-default select-none rounded-[.35rem] bg-[#3D3D3D] px-2 py-0.5 text-[#DCDCDC] focus:outline-none"
            href="https://patrickpc.gumroad.com/l/quickcast"
            target="_blank"
          >
            Donate
          </a>
          <button
            className="cursor-default select-none rounded-[.35rem] bg-[#3D3D3D] px-2 py-0.5 text-[#DCDCDC] focus:outline-none"
            onClick={null}
          >
            Exit App
          </button>
        </div>
        <p className="select-none font-medium text-[#DCDCDC] focus:outline-none">
          Made by{' '}
          <a
            className="cursor-default select-none focus:outline-none"
            href="https://twitter.com/_patrickpc"
            target="_blank"
          >
            Patrick 🫶
          </a>
        </p>
      </div>
    </div>
  )
}
