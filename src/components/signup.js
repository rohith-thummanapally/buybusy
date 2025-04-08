import { useContext } from "react";
import { db } from "../firebase-init";
//import userContext from "../usercontext";
import { addDoc,collection,doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signupthunk } from "../redux/authslice";
import { useDispatch } from "react-redux";
function Signup()
{
    //let {user,setUser}=useContext(userContext);
    let dispatch=useDispatch();
    let navigate=useNavigate();
    const createAccount=async(e)=>{
        
        e.preventDefault();
        let name=e.target[0].value;
        let email=e.target[1].value;
        let password=e.target[2].value;
        dispatch(signupthunk({name:name,email:email,password:password,nav:navigate}));
        /*let conn=collection(db,'users');
        let newdoc=await addDoc(conn,{name,email,password});
        console.log(newdoc.id);
        if(newdoc.id)
        {
            setUser(newdoc.id);
            navigate('/');
        }*/
    }
    return(
        <div style={styles.signuppage}>
            <div style={{width:'50%',marginLeft:'25%'}}>
            <div>
                <p style={{color:'#224957',fontSize:'2.7em',fontFamily:'Quicksand, sans-serif',fontWeight:'900'}}>Sign Up</p>
            </div>
            <form style={styles.formstyle} onSubmit={(e)=>{createAccount(e)}}>
                <input style={styles.inpbox} placeholder="Enter Name" required />
                <br/>
                <input style={styles.inpbox} placeholder="Enter Email" required />
                <br/>
                <input style={styles.inpbox} type="password" placeholder="Enter Password" required />
                <br/>
                <button style={{width:'43%',height:'35px',backgroundColor:'#7064e5',fontSize:'1.2em',boxShadow:'0px 4px 4px rgba(0,0,0,.3)',color:'#ffffff',border:'none',borderRadius:'10px'}} >Sign Up</button>
                
            </form>
            </div>
        </div>
    )
}
const styles={
    signuppage:{
        display:"flex",
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'flex-start',
        height:'90%',
        width:'100%'
    },
    formstyle:{width:'100%',display:'flex',flexDirection:'column',alignItems:'flex-start'},
    inpbox:{width:'50%',height:'30px',border:'1.5px solid #7064e5',borderRadius:'10px',fontSize:'1.2em',background:'#f4f6f8',padding:'10px',marginBottom:'20px'}

}
export default Signup