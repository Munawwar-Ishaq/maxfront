import { io } from "socket.io-client";
import Cookie from 'js-cookie'
let local = 'localhost'
// let ip = '192.168.1.110'

// export const BaseUrl = `https://maxchatx-fqrw4wk7e-munawwarishaq123s-projects.vercel.app/api/v1`;

// export const Socket = io(`https://maxchatx-fqrw4wk7e-munawwarishaq123s-projects.vercel.app` , {
//     autoConnect : false,
//     auth : {
//         token : Cookie.get('tkn'),
//     }
// })
export const BaseUrl = `http://${local}:4000/api/v1`;
export const Socket = io(`http://${local}:4000` , {
    autoConnect : false,
    auth : {
        token : Cookie.get('tkn'),
    }
})