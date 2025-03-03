import React, { Component } from 'react';
import AceEditor from 'react-ace';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import { INPUT } from '../../../config/appInstanceResourceTypes';
import { setCode } from '../../../actions';
import { JAVASCRIPT } from '../../../config/programmingLanguages';

const styles = () => ({});

class Editor extends Component {
  static propTypes = {
    dispatchSetCode: PropTypes.func.isRequired,
    code: PropTypes.string,
    programmingLanguage: PropTypes.string,
    appInstanceId: PropTypes.string,
  };

  static defaultProps = {
    code: '',
    appInstanceId: null,
    programmingLanguage: JAVASCRIPT,
  };

  onChange = code => {
    const { dispatchSetCode } = this.props;
    dispatchSetCode(code);
  };

  onLoad = () => {
    const { dispatchSetCode, code } = this.props;
    dispatchSetCode(code);
  };

  render() {
    const { code, appInstanceId, programmingLanguage } = this.props;
    return (
      <AceEditor
        placeholder="function () { console.log('Placeholder Text'); }"
        mode={programmingLanguage}
        theme="xcode"
        name={appInstanceId || Math.random()}
        height="50%"
        width="100%"
        onLoad={this.onLoad}
        onChange={this.onChange}
        fontSize={14}
        showPrintMargin
        showGutter
        highlightActiveLine
        value={code || ''}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    );
  }
}

const mapStateToProps = ({ context, appInstanceResources, appInstance }) => {
  const { userId, appInstanceId } = context;
  const {
    content: {
      settings: { programmingLanguage },
    },
  } = appInstance;
  const inputResource = appInstanceResources.content.find(({ user, type }) => {
    return user === userId && type === INPUT;
  });
  return {
    appInstanceId,
    programmingLanguage,
    code: inputResource && inputResource.data,
  };
};

const mapDispatchToProps = {
  dispatchSetCode: setCode,
};

const StyledComponent = withStyles(styles)(Editor);

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledComponent);

export default withTranslation()(ConnectedComponent);
