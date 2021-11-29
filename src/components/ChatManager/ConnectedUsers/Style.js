import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 250;

const Style = makeStyles({
      root:{
        display:'flex'
      },
    drawer: {
        width:drawerWidth
      },
      drawerPaper: {
        width:drawerWidth,
        paddingLeft:"5px"
      }
  });

  export default Style;