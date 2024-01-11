import { Link } from "@chakra-ui/react";
import { useState } from "react";

const SubMenu = ({ item }:any) => {
    const [subnav, setSubnav] = useState(false);
  
    const showSubnav = () => setSubnav(!subnav);
  
    console.log(item);
    
    return (
      <>
        <Link className="sidebar-link"  onClick={item.subNav && showSubnav}>
          <div style={{display:"flex",alignItems:"center", width:"130px"}}>
            {/* {item.icon}  */}
            <span>{item.title}</span>
          </div>
          <div>
            {item.subNav && subnav
              ? item.iconOpened
              : item.subNav
              ? item.iconClosed
              : null}
          </div>
        </Link>
        {subnav &&
          item.subNav.map((item:any, index:any) => {
            return (
              <Link className="dropdown-link"  key={index}>
                {item.icon}
                <span >{item.title}</span>
              </Link>
            );
          })}
          <hr />
      </>
    );
  };
  
  export default SubMenu;