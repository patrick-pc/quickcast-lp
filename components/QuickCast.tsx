import { useState, useEffect, useRef } from 'react'
import { CodeBlock } from '../components/CodeBlock'
import { Copy, Check, Command, Trash } from 'react-feather'
import { createParser } from 'eventsource-parser'
import { Logo } from '../components/Logo'
import { MemoizedReactMarkdown } from '../components/MemoizedReactMarkDown'
import { Settings } from '../components/Settings'
import { useChatScroll } from '../hooks/useChatScroll'
import { useLocalStorage } from '../hooks/useLocalStorage'
import rehypeMathjax from 'rehype-mathjax'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import TextareaAutosize from 'react-textarea-autosize'

const INVALID_API_KEY_PROMPT =
  'Invalid API key. You can find yours here at https://platform.openai.com/account/api-keys'

export const QuickCast = ({ isActive, setIsActive }) => {
  const [model, setModel] = useLocalStorage('model', 'gpt-3.5-turbo')
  const [prompt, setPrompt] = useLocalStorage(
    'prompt',
    'You are ChatGPT, a large language model trained by OpenAI.'
  )
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_OPENAI_API_KEY)

  const [message, setMessage] = useState('')
  const [lastMessage, setLastMessage] = useState('')
  const [conversation, setConversation] = useState([
    {
      role: 'system',
      content: `$${prompt}. Follow the user's instructions carefully. Respond using markdown.`,
    },
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [settingsPage, setSettingsPage] = useState(false)
  const [hover, setHover] = useState({})
  const inputRef = useRef(null)
  const mainRef = useRef(null)
  const conversationRef = useChatScroll(conversation)

  useEffect(() => {
    setConversation([{ role: 'system', content: prompt }])
  }, [prompt])

  useEffect(() => {
    if (!isActive) return

    inputRef.current.focus()
    inputRef.current.select()
  }, [isActive, settingsPage])

  const sendMessage = async (regenerate = false) => {
    const trimmedMessage = message.trim()

    if (!trimmedMessage) return
    if (settingsPage) setSettingsPage(false)

    const oldMessage = message
    const oldConversation = conversation
    const updatedConversation = [
      ...conversation,
      {
        role: 'user',
        content: trimmedMessage,
      },
    ]

    setMessage('')
    setConversation(updatedConversation)
    setLastMessage(oldMessage)
    setIsGenerating(true)

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: updatedConversation,
          stream: true,
        }),
      })

      if (response.status === 401) {
        setConversation([
          ...updatedConversation,
          { role: 'assistant', content: INVALID_API_KEY_PROMPT },
        ])

        return
      } else if (response.status !== 200) {
        const { error } = await response.json()
        throw Error(error.message)
      }

      let newMessage = ''
      const parser = createParser((event) => {
        if (event.type === 'event') {
          const data = event.data
          if (data === '[DONE]') {
            return
          }
          const json = JSON.parse(event.data)
          const content = json.choices[0].delta.content

          if (!content) return

          newMessage += content
          setConversation([...updatedConversation, { role: 'assistant', content: newMessage }])
        } else {
          return ''
        }
      })

      const reader = response.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = new TextDecoder().decode(value)
        parser.feed(text)
      }
    } catch (error) {
      setConversation([...updatedConversation, { role: 'assistant', content: error.message }])
      setMessage(oldMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  const handleEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
    if (e.key === 'ArrowUp') {
      setMessage(lastMessage)
      setTimeout(() => {
        inputRef.current.select()
      }, 1)
    }
  }

  const handleMouseOver = (index: number) => {
    setHover((c) => {
      return {
        ...c,
        [index]: true,
      }
    })
  }

  const handleMouseOut = (index: number) => {
    if (isCopied) {
      setTimeout(() => {
        setHover((c) => {
          return {
            ...c,
            [index]: false,
          }
        })
      }, 800)
    } else {
      setHover((c) => {
        return {
          ...c,
          [index]: false,
        }
      })
    }
  }

  const toggleSettingsPage = () => {
    setSettingsPage((c) => !c)
  }

  const refreshPage = () => {
    setMessage('')
    setSettingsPage(false)
    setConversation([{ role: 'system', content: prompt }])
    inputRef.current.focus()
    inputRef.current.select()
  }

  return (
    <main
      className={`absolute left-0 right-0 z-50 mx-auto mt-32 flex h-screen max-h-[475px] flex-col px-4 text-[#DDDDDD] sm:w-full md:w-[750px] ${
        isActive ? 'block' : 'hidden'
      }`}
      ref={mainRef}
    >
      <div className="relative flex w-full">
        <TextareaAutosize
          className={`z-10 w-full border border-[#676767] bg-[#292929] py-3 pl-4 pr-12 text-lg placeholder-[#949494] focus:outline-none [&::-webkit-scrollbar]:hidden ${
            conversation.length > 1 || settingsPage
              ? 'rounded-t-xl border-b-[#434343]'
              : 'rounded-xl'
          }`}
          placeholder="Ask anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleEnterPress}
          minRows={1}
          maxRows={10}
          ref={inputRef}
        />

        <button
          className="absolute right-0 top-0 z-20 focus:outline-none"
          onClick={toggleSettingsPage}
        >
          <span className="flex h-[3.25rem] w-[3.25rem] items-center justify-center">
            <Logo
              className={`h-5 w-5 ${
                isGenerating
                  ? 'animate-pulse text-[#FFD60A]'
                  : settingsPage
                  ? 'text-[#FFFFFF]'
                  : 'text-[#949494]'
              }`}
            />
          </span>
        </button>
      </div>

      {!settingsPage ? (
        <div
          className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden rounded-b-xl [&::-webkit-scrollbar]:hidden"
          ref={conversationRef}
        >
          {conversation.length > 1 && (
            <div className="rounded-b-xl border-x border-b border-[#676767] bg-[#1F1F1F]">
              {conversation.map((message: { role: string; content: string }, i: number) => {
                return (
                  <div className="prose relative max-w-4xl px-4 dark:prose-invert" key={i}>
                    {message.role !== 'system' &&
                      (message.role === 'user' ? (
                        <p className="mt-4 text-[#949494]" key={i}>
                          {message.content}
                        </p>
                      ) : (
                        <div
                          className="relative"
                          onMouseOver={() => handleMouseOver(i)}
                          onMouseOut={() => handleMouseOut(i)}
                        >
                          <MemoizedReactMarkdown
                            className="prose max-w-4xl dark:prose-invert"
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeMathjax]}
                            linkTarget="_blank"
                            components={{
                              code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline ? (
                                  <CodeBlock
                                    language={(match && match[1]) || ''}
                                    value={String(children).replace(/\n$/, '')}
                                    {...props}
                                  />
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                )
                              },
                              table({ children }) {
                                return (
                                  <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                                    {children}
                                  </table>
                                )
                              },
                              th({ children }) {
                                return (
                                  <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                                    {children}
                                  </th>
                                )
                              },
                              td({ children }) {
                                return (
                                  <td className="break-words border border-black px-3 py-1 dark:border-white">
                                    {children}
                                  </td>
                                )
                              },
                            }}
                          >
                            {message.content}
                          </MemoizedReactMarkdown>

                          {message.content === INVALID_API_KEY_PROMPT ? (
                            <button
                              className="w-16 select-none rounded-[.35rem] bg-[#484848] px-2 text-xs text-[#ADADAD] focus:outline-none"
                              onClick={() => {
                                setSettingsPage(true)
                                setConversation([{ role: 'system', content: prompt }])
                              }}
                            >
                              Set Key
                            </button>
                          ) : (
                            <div
                              className={`absolute bottom-0 right-0 h-auto w-6 ${
                                hover[i] ? 'visible' : 'invisible'
                              }`}
                            >
                              {!isGenerating && (
                                <button
                                  className="mb-1"
                                  onClick={() => copyContent(message.content)}
                                >
                                  {isCopied ? (
                                    <Check className="text-[#32D74B]" size={18} />
                                  ) : (
                                    <Copy className="text-[#949494]" size={18} />
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )
              })}

              <div className="relative mt-4 flex h-10 w-full items-center justify-between rounded-b-xl border-t border-t-[#434343] px-2">
                <div
                  className="flex h-[1.8rem] w-[1.8rem] cursor-pointer select-none items-center justify-center gap-1 rounded-lg py-1 text-[#949494] transition hover:bg-[#292929] focus:outline-none"
                  onClick={toggleSettingsPage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                    />
                  </svg>
                </div>

                <div
                  className="flex cursor-pointer select-none items-center justify-center gap-1 rounded-lg px-2 py-1 transition hover:bg-[#292929] focus:outline-none"
                  onClick={refreshPage}
                >
                  <p className="mr-1 text-xs font-medium text-[#949494]">Clear</p>
                  <button className="flex h-5 w-5 items-center justify-center rounded-[.35rem] bg-[#484848] text-xs text-[#ADADAD] focus:outline-none">
                    <Trash size={12} />
                  </button>
                  {/* <button className="flex h-5 w-5 items-center justify-center rounded-[.35rem] bg-[#484848] text-xs text-[#ADADAD] focus:outline-none">
                      R
                    </button> */}
                </div>
              </div>
            </div>
          )}
          <div className="h-full" onClick={() => setIsActive(false)}></div>
        </div>
      ) : (
        <Settings
          isActive={isActive}
          setIsActive={setIsActive}
          model={model}
          setModel={setModel}
          prompt={prompt}
          setPrompt={setPrompt}
          apiKey={apiKey}
          setApiKey={setApiKey}
        />
      )}
    </main>
  )
}
