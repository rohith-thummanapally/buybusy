export const loggermiddleware=(state)=>{
    return (next)=>{
        return (action)=>{
            console.log('Log :'+action.type+' , Timestamp:'+Date.toString());
        }
    }
} 