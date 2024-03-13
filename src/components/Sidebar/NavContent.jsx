import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as DiscordIcon } from "../../assets/icons/discord.svg";
import { ReactComponent as TwitterIcon } from "../../assets/icons/twitter.svg";
import { ReactComponent as GithubIcon } from "../../assets/icons/github.svg";
import { ReactComponent as MediumIcon } from "../../assets/icons/medium.svg";
import { ReactComponent as TelegramIcon } from "../../assets/icons/telegram.svg";
import { ReactComponent as LogoIcon } from "../../assets/icons/SmartNode.svg";
import { trim, shorten } from "../../helpers";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import { Paper, Link, Box, Typography, SvgIcon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const { chainID } = useWeb3Context();

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
      return true;
    }
    return false;
  }, []);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
        </div>
      </Box>
    </Paper>
  );
}

export default NavContent;
