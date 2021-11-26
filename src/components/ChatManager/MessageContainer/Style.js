import { makeStyles } from '@material-ui/core/styles';

const Style = makeStyles({
    messageArea: {
      height: '70vh',
      width:'100%',
      overflowY: 'auto',
      padding:'3%'
    },
    messageAreaHeader: {
      position: 'fixed',
      top: '0',
      width: '100%',
    }
  });

  export default Style;