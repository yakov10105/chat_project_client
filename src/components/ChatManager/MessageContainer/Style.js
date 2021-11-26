import { makeStyles } from '@material-ui/core/styles';

const Style = makeStyles({
    messageArea: {
      height: '70vh',
      width:'100%',
      overflowY: 'auto',
      padding:'0px'
    },
    messageAreaHeader: {
      color: 'black',
      borderBottomLeftRadius:'30px',
      borderBottomRightRadius:'30px',
      border: '1px solid #bcbcbc'

    }
  });

  export default Style;