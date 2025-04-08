function Items(props)
    {
        let products=props.products;
        if (!products || products.length === 0) {
            return <p>No products available</p>; // Handle empty data
        }
        return (
            <div>
                {products.map((iprod,index)=>(
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around',width:'Inherit',padding:'20px 0px' }}>
                    {iprod.map((proditem,idx)=>(
                        <div style={{display:'flex',flexDirection:'column',width:'200px',height:'400px',backgroundColor:'#ffffff',padding:'15px',borderRadius:'5px',boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)",}}>
                            <img src={proditem['Image']} style={{minHeight:'250px',maxHeight:'250px',objectFit:'contain'}} />
                            <div style={{height:'80px'}}>
                                <p style={{display: "-webkit-box",WebkitLineClamp: 3,WebkitBoxOrient: "vertical",overflow: "hidden",textOverflow: "ellipsis"}}>
                                    {proditem['Name']}
                                </p>
                            </div>
                            <div style={{margin:'0px 0px 5px 0px ',display:'flex',flexDirection:'row',justifyContent:'space-between',padding:'10px 10px 5px 10px'}}>
                            <div style={{fontSize:'18px',fontWeight:'600'}}>
                            ₹ {proditem['Price']} 
                            </div>
                            {props.cart &&
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <img onClick={()=>{props.addordecitem(proditem['id'],-1)}} style={{width:'25px',height:'25px',objectFit:'contain'}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABFElEQVR4nO2WT2rCQBTGf5dwUWuK55D2AIVWeg012rN016J00aX7/rmJEU9h4s6IZeAJocTJm0mmZOEH3yaQ/Hhf3rw3cFELdQNMgR8gAXbiRJ7FQNQk8Bp4A3LgWOEDsAT6daFPQKYA/nUKDH2hz1KBK7RY/cyn0kMNaBGurrznGa8t9q4G/N4g9OS55shoutfVuSR5VrMA0JMnNvB3QPCnDbwJCE5s4LTkhQHuuj3T3U5g8xFX3bmC1wGjXrWyueKA4JENHAUaIPuqAWK0CAB+Rbn4y7rb11vgCqXuG4rcrMVHLbQ4t+teBMwdzUtDz9hNvA/UVAd4kc7UVPnh8k816slq+5IplIlXMhzGmiNzEf+tX262pRCJmsimAAAAAElFTkSuQmCC" />
                                    <p style={{margin:'0px',padding:'0px 5px'}}>{proditem['counter']}</p>
                                    <img onClick={()=>{props.addordecitem(proditem['id'],1)}} style={{width:'25px',height:'25px',objectFit:'contain'}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABHUlEQVR4nO2WQWrCQBSGv0t0oVXxHFIPIKj0GlWrZ3HXonTRpXutNzHFUxjdNZISeEIIY/Je0iku/OFtwpCP988/bwbuukG1gFdgCwTASSqQbxOg+ZfAR+AdiIC4oM7ACmhXhT4DRwUwWyEwLAudSQdWaLr7aZlOzxWgabi684bS3g7wpLS9rgF/KLu5SLN2oTkykQdwJE5e1dSwfxZwDIzzwF8ewes88N4jOMgDh1fSa5Ur7aEVnPzEqq4V/O3R6t1NhmviEfySB256GiA/RQMk0dID+A3lxe9KtyvtrvRm6wDUUKpnsLzoWhxooem5XfUhkLzRSmmotN1lb5+KegDmkkxNl5+WPdWoIVfbRqbQUWonw2GkOTJ38d/6BZ8CjheXznrAAAAAAElFTkSuQmCC" />
                                </div>
                            }
                            </div>
                            
                            <button onClick={()=>{!props.cart? props.addtocart(proditem['id']) : props.removefromcart(proditem['id'])}} >{!props.cart ? 'Add to Cart' :'Remove from Cart' }</button>
                        </div>      
                    ))
                    }
                    </div>
                ))
                }
            </div>
        );
    }
    export default Items;