import Queue from '../queue/Queue';
import { connect } from "react-redux";
import {push} from "connected-react-router";

class ActiveVisits extends Queue {

  redirectToInfoPageActionCreator() {
    return push({
      pathname: '/checkin/checkInComplete',
      state: {
        queueLink: '/visit/queue'
      }
    });
  }

  title() {
    return "Active Visits";
  }
}

const mapStateToProps = (state) => {
  return {
    rowData: state.activeVisits.list
  };
};

export default connect(mapStateToProps)(ActiveVisits);