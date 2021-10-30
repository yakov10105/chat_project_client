import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Chat = () => {
    const [data,setData] = useState([])
    useEffect(()=>{
        axios.get("http://localhost:3495/api/auth/user",{
                headers:{
                    "Authorization": localStorage.getItem("key")
                }
            }).then((res)=>{
                setData(res.data.authorized)
            }).catch((err)=>{
                setData(err.message)
            })
    })


    return (
        <div>
          {data}
        </div>
    )
}

export default Chat
