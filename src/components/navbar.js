import userContext from "../usercontext";
import { useContext } from "react";
import { NavLink,BrowserRouter } from "react-router-dom";
function Navbar()
{
    let {user,setUser}=useContext(userContext);

    return (
        <div style={{display:'flex',justifyContent:'space-between',padding:'10px 25px 10px 100px'}}>
            <div style={{display:'flex',flex:4,alignItems:'center'}}>
                <a href='/' style={{textDecoration:'none',cursor:'pointer',fontSize:'22px'}}>Busy Buy</a>
            </div>
            <div style={{display:'flex',flex:8,flexDirection:'row',justifyContent:'space-around'}}>
                <NavLink to='/' style={{textDecoration:'none'}} end>
                    <div>
                        <p style={Styles.navitems}>
                            Home
                        </p>
                    </div>
                </NavLink>
                {user &&
                    <>
                    <NavLink to='/myorders' style={{textDecoration:'none'}} end>
                    <div>
                        <p style={Styles.navitems}>MyOrders</p>
                    </div>
                    </NavLink>
                    <NavLink to='/cart' style={{textDecoration:'none'}} end>
                    <div>
                        <p style={Styles.navitems}>Cart</p>
                    </div>
                    </NavLink>
                    <div onClick={()=>{setUser('')}}>
                        <p style={Styles.navitems}>Logout</p>
                    </div>
                    </>}
                {!user &&
                <NavLink to='/signin' style={{textDecoration:'none'}} end><div>
                    <p style={Styles.navitems}>Signin</p>
                </div>
                </NavLink>
                }
            </div>
        </div>
    );
}
const Styles={
    navitems:{
        color: '#7064e5',
        fontFamily: 'Quicksand, sans-serif',
        fontSize: '18px',
        fontWeight: 'bolder',
        textDecoration:'none'
        //height: '100%',
        //padding: '1rem 1.1rem',
    }
}
export default Navbar;