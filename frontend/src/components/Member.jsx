import React from "react";
import "../components/Member.css";

function Member({name,role}){
return(
  
  <div className="member">
  
  <div className="image"></div>
  <div className="name"><h3 >{name}</h3></div>
<div className="role"><h4>{role}</h4></div>
<div class="dot">
</div>
<div class="dot">
</div>
<div class="dot">
</div>
<div class="dot">
</div>
</div>
);
}
export default Member