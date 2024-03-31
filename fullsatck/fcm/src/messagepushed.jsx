import './message.css'
const Message = ({ notification }) => {
    return (
      <>
        <div id="notificationHeader">
          {/* image is optional */}
          {notification.icon && (
            <div id="imageContainer">
              <img src={notification.icon} width={100} />
            </div>
          )}
          <span>{notification.title}</span>
        </div>
        <div id="notificationBody">{notification.body}</div>
      </>
    );
  };
  
  export default Message;