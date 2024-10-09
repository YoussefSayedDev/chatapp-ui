import ChatsList from "./chats/ChatsList";
import ChatBox from "./conversation/ChatBox";
import UsersList from "./users/UsersList";

const App = () => {
  return (
    <div className='container mx-auto px-5'>
      <UsersList />
      <div className='flex justify-between w-full height-chat gap-3'>
        <ChatsList />
        <ChatBox />
      </div>
    </div>
  );
};

export default App;
