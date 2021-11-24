import React,{useState,useEffect,useContext} from "react";

const getMessagesHistory = (props) => {

    const [messages, setMessages] = useState([]); 
    const senderUserName = props.senderUserName
    const recieverUserName = props.recieverUserName

    const getMessagesHistory = ()=>{
        axios.get(`http://localhost:8082/api/messages/get-messages?senderUserName=${senderUserName}&recieverUserName=${recieverUserName}`,{
          headers:{
            "Authorization":localStorage.getItem('key')
          }
        })
        .then(res=>{
            if(res.data){
              const list = [];
              for(let i=0;i<res.data.length;i++){
                list.push({user:res.data[i].senderUserName, message:res.data[i].text , date:res.data[i].date})
              }
              setMessages(list)
            }
        }).catch(err=>{
          console.log(err)
        })
      }

      return messages
  }
  
  export default getMessagesHistory