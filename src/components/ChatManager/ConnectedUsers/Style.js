import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 250;

const Style = makeStyles({
    drawer: {
        width:drawerWidth
      },
      drawerPaper: {
        width:drawerWidth
      },
      root:{
        display:'flex'
      }
  });

  export default Style;