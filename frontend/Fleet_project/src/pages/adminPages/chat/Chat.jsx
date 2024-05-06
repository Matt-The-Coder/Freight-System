import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import '/public/assets/css/adminLayout/adminChat.css'
import Breadcrumbs from '@/components/adminDashboard/Breadcrumbs'
import Sidebar from '@/components/adminDashboard/Sidebar'
const AdminChat = ({ socket }) => {
  const uploadingServer = import.meta.env.VITE_UPLOADING_SERVER
  const messageContainer = useRef()
  const { u_username, u_role, u_profile_picture, setIsLoading} = useOutletContext()
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([])
  const [scroll, setScroll] = useState(false)
  useEffect(()=>{
    messageContainer.current.scrollTop = messageContainer.current.scrollHeight
    console.log(messageContainer.current.scrollTop)
    console.log(messageContainer.current.scrollHeight)
  }, [scroll])

  const sendMessage = (e) => {
    e.preventDefault()
    if (message !== '') {
      const __createdtime__ = Date.now();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit('send_message', { username: u_username, role: u_role, message, __createdtime__, picture: u_profile_picture });
      setMessage('');
      setScroll(!scroll)
    }
  }


  //  For Welcoming!
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessagesReceived((state) => [
        ...state,
        {
          username: data.username,
          role: data.role,
          message: data.message,
          timesent: data.__createdtime__,
          prof_pic: data.picture
        },
      ]);
      setScroll(!scroll)
    });
    return () => socket.off('receive_message');

  }, [socket]);

  // Send users to the server
  useEffect(() => {
    if(u_username !== undefined){
      socket.emit('active', { username: u_username })
    }
    setScroll(!scroll)
    return () => socket.off('active')
  }, [u_username,socket])

  // Get All Current Users
  useEffect(() => {
    socket.on('usersActive', (activeUsers) => {
      setUsers(activeUsers)
    })
  }, [socket])

  useEffect(() => {
    setIsLoading(true)
    // Last 100 messages sent in the chat room (fetched from the db in backend)
    socket.on('last_100_messages', (last100Messages) => {
      // Sort these messages by __createdtime__
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...state, ...last100Messages]);
      setScroll(!scroll)
    });
    setIsLoading(false)
    return () => socket.off('last_100_messages');
  }, [socket]);

  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
  return (


    <>
    <Breadcrumbs title="Chat"/>
      <Sidebar/>
      <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white dark:bg-neutral-800">
      <a class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800" href="#">
      <div class="p-4 md:p-5">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="group-hover:text-primary_blue font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
            Currently Active
            </h3>
            <div className="flex gap-3">
            {users.map((user, i) => {
            return (
              <p key={i} class="text-sm text-gray-500 dark:text-neutral-500">
              <span class="size-2 inline-block bg-green-500 rounded-full me-2"></span>
  <span class="text-gray-600 dark:text-neutral-400">{user}</span>
            </p>
            )
          })}
            </div>
          </div>

        </div>
      </div>
    </a>


  {/* Chat Bubble */}
  <ul className="space-y-5 overflow-y-scroll h-[50vh]" ref={messageContainer}>
  {messagesRecieved.map((message, i) => {
              return (
    <li key={i} className="max-w-full flex gap-x-2 sm:gap-x-4 me-11">
    <img
      className="inline-block size-9 rounded-full object-cover"
      src={`${uploadingServer}${message.prof_pic}`}
      alt="Image Description"
    />
    <div className="w-3/4">
      {/* Card */}
      <div className="bg-white border w-[120%] md:w-full border-gray-200 rounded-2xl p-4 space-y-3 dark:bg-neutral-900 dark:border-neutral-700">
        <h2 className="font-medium text-gray-800 dark:text-white">
        {message.username}
        <span className="text-xs text-justify capitalize block md:inline md:ml-1">    -{message.role}</span>
        </h2>
  
        <div className="space-y-1.5">
          <p className="text-sm text-gray-800 dark:text-white">
           {message.message}
          </p>
        </div>
      </div>
      {/* End Card */}
      <span className="mt-1.5 flex items-center gap-x-1 text-xs text-gray-500 dark:text-neutral-500">
        <svg
          className="flex-shrink-0 size-3"
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 7 17l-5-5" />
          <path d="m22 10-7.5 7.5L13 16" />
        </svg>
        Sent at {formatDateFromTimestamp(message.__createdtime__ ? message.__createdtime__ : message.timesent)}
      </span>
    </div>
  </li>

              )

            })}

  </ul>

  {/* Content */}
  <div className="relative">

    {/* Search */}
    <footer className="sticky bottom-0 z-10 bg-white border-t border-gray-200 pt-2 pb-3 sm:pt-4 sm:pb-6 dark:bg-[#262626]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Input */}

        <div className="relative">
        <form className="p-0" onSubmit={(e) => { sendMessage(e) }}>
          <textarea
          rows="1" cols="50"
            className="p-4  pb-12 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Enter Message..."
            onChange={(e) => { setMessage(e.currentTarget.value) }} value={message}
            defaultValue={""}
          />
          {/* Toolbar */}
          <div className="absolute bottom-px inset-x-px p-2 rounded-b-md bg-white dark:bg-neutral-900">
            <div className="flex justify-between items-center">
              {/* Button Group */}
              <div className="flex items-center">

              </div>
              {/* End Button Group */}
              {/* Button Group */}
              <div className="flex items-center gap-x-1">
               
                {/* Send Button */}
                <button
                  type="submit"
                  className="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                </svg>
                </button>
                {/* End Send Button */}
              </div>
              {/* End Button Group */}
            </div>
          </div>
          </form>
          {/* End Toolbar */}
        </div>
        {/* End Input */}

      </div>
    </footer>
    {/* End Search */}
  </div>
  {/* End Content */}
  </div>
  </div>


  {/* End Chat Bubble */}


    </>
  )
}

export default AdminChat