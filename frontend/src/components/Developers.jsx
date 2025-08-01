import React  from "react";
import Member from "../components/Member";
const Developers=()=>{
    return(
        <div >
            <div style={{display:"flex",gap:"35%"}}> 
        <button style={{border:0,backgroundColor:'transparent',fontSize:'20px',marginTop:"20px",border:"none"}}> &lt; back</button>
        <h1>Developers</h1>
        </div>
   <Member name="Dhunush Sai Nayak.V" role="Lead Developer"/>
   <Member name="Dhunush Sai Nayak.V" role="Lead Developer"/>
   <Member name="Dhunush Sai Nayak.V" role="Lead Developer"/>
   <Member name="Dhunush Sai Nayak.V" role="Lead Developer"/>
     </div>

    )
}
export default Developers;