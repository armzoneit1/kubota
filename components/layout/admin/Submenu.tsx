import { useState } from "react";
import { Flex, Icon, FlexProps, Link, Tooltip } from "@chakra-ui/react"
import { IconType } from "react-icons"
import { ReactText } from "react"
interface SubMenuProps extends FlexProps {
  item: any
  // icon: IconType
  // children: ReactText
  // link: string
  isOpen?: boolean
  // mobileSize?: boolean
  // onClose: () => void
}

const SubMenu = ({ item ,isOpen}:SubMenuProps ,) => {
    const [subnav, setSubnav] = useState(false);
  
    const showSubnav = () => setSubnav(!subnav);
  
    console.log(isOpen);
    
    return (
      (isOpen ?<>
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
              <Link className="dropdown-link"  key={index}  href={item.path}>
               {item.icon && <Icon
                mr="4"
                fontSize="20"
                _groupHover={{
                  color: "primary.500",
                }}
                as={item.icon}
              />}
                {/* {item.icon} */}
                <span >{item.title}</span>
              </Link>
            );
          })}
          <hr />
      </> :
      <>
         <Tooltip label={item.title} >
                <Link display={"flex"} justifyContent={"center"} mb={"2rem"} mt={"1.5rem"} href={item.path}>{item.icon}</Link>
                
              </Tooltip>
              </>)
    );
  };
  
  export default SubMenu;