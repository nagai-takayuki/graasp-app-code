import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ReactTerminal, { ReactThemes } from 'react-terminal-component';
import {
  getAppInstanceResources,
  patchAppInstanceResource,
  postAppInstanceResource,
  setCode,
} from '../../../actions';
import { FEEDBACK, INPUT } from '../../../config/appInstanceResourceTypes';
import Loader from '../../common/Loader';
import Editor from './Editor';
// import {
//   DEFAULT_MAX_INPUT_LENGTH,
//   DEFAULT_MAX_ROWS,
// } from '../../../config/settings';

const Terminal = require('javascript-terminal');

const styles = theme => ({
  main: {
    flex: 1,
    // 64px is the height of the header
    height: 'calc(100% - 64px)',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    overflowX: 'hidden',
  },
  message: {
    padding: theme.spacing.unit,
    backgroundColor: theme.status.danger.background[500],
    color: theme.status.danger.color,
    marginBottom: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    marginRight: theme.spacing.unit,
  },
});

class StudentView extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchGetAppInstanceResources: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      main: PropTypes.string,
      container: PropTypes.string,
      message: PropTypes.string,
      button: PropTypes.string,
      textField: PropTypes.string,
    }).isRequired,
    feedback: PropTypes.string,
    userId: PropTypes.string,
    ready: PropTypes.bool,
    activity: PropTypes.bool,
    output: PropTypes.string,
  };

  static defaultProps = {
    feedback: '',
    userId: null,
    activity: false,
    ready: false,
    output: '',
  };

  constructor(props) {
    super(props);
    const { userId } = props;
    // get the resources for this user
    props.dispatchGetAppInstanceResources({ userId });
  }

  render() {
    const { t, classes, ready, activity, output } = this.props;

    // todo: implement feedback
    let { feedback } = this.props;
    if (feedback && feedback !== '') {
      feedback = `${t('Feedback')}: ${feedback}`;
    }

    if (!ready || activity) {
      return <Loader />;
    }

    // prepare output for printing in the terminal
    const textOutput = Terminal.OutputFactory.makeTextOutput(output);
    const customOutputs = Terminal.Outputs.create([textOutput]);
    const emulatorState = Terminal.EmulatorState.create({
      outputs: customOutputs,
    });

    return (
      <div className={classes.main}>
        <Editor />
        <ReactTerminal
          theme={{
            ...ReactThemes.hacker,
            width: '100%',
            height: '50%',
            spacing: '0 5px',
          }}
          emulatorState={emulatorState}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ context, appInstanceResources, code }) => {
  const { userId, offline, appInstanceId } = context;
  const inputResource = appInstanceResources.content.find(({ user, type }) => {
    return user === userId && type === INPUT;
  });
  const feedbackResource = appInstanceResources.content.find(
    ({ user, type }) => {
      return user === userId && type === FEEDBACK;
    }
  );

  return {
    userId,
    offline,
    appInstanceId,
    inputResourceId: inputResource && (inputResource.id || inputResource._id),
    activity: Boolean(appInstanceResources.activity.length),
    ready: appInstanceResources.ready,
    code: inputResource && inputResource.data,
    feedback: feedbackResource && feedbackResource.data,
    output: code.output,
  };
};

const mapDispatchToProps = {
  dispatchGetAppInstanceResources: getAppInstanceResources,
  dispatchPostAppInstanceResource: postAppInstanceResource,
  dispatchPatchAppInstanceResource: patchAppInstanceResource,
  dispatchSetCode: setCode,
};

const StyledComponent = withStyles(styles)(StudentView);

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledComponent);

export default withTranslation()(ConnectedComponent);
