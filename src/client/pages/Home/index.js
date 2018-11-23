import React from 'react';
import {createItem, updateItem, getDocument, deleteItem} from 'Actions/document';
import {BTN_TYPE_BACK, BTN_TYPE_CREATE_FILE, BTN_TYPE_CREATE_FOLDER, TYPE_FILE, TYPE_FOLDER} from 'Constants/misc';
import {getMe} from 'Actions/account';
import {Button, Modal} from "react-bootstrap";
import {connect} from 'react-redux';
// import child components
import ActionButtons from './components/ActionButtons';
import FolderModal from './components/FolderModal';
import FileModal from './components/FileModal';
import ListView from './components/ListView';

class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.goToFolder = this.goToFolder.bind(this);
    this.handleBackToFolder = this.handleBackToFolder.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleItemEdit = this.handleItemEdit.bind(this);
    this.handleItemRemove = this.handleItemRemove.bind(this);
    this.handlePopupClose = this.handlePopupClose.bind(this);

    this.state = {
      actionButtons: [
        {
          type: BTN_TYPE_BACK,
          text: 'Back to',
          enabled: true,
          callback: this.handleBackToFolder
        },
        {
          type: BTN_TYPE_CREATE_FOLDER,
          text: 'Create folder',
          enabled: true,
          callback: () => this.setState({showFolderModal: true, selectedItem: null})
        },
        {
          type: BTN_TYPE_CREATE_FILE,
          text: 'Create file',
          enabled: true,
          callback: () => this.setState({showFileModal: true, selectedItem: null})
        }
      ],
      showFileModal: false,
      showFolderModal: false,
      selectedItem: null
    };
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(getDocument());
  }
  componentWillReceiveProps(props) {
    const backBtnEnableState = props.currentFolder && props.currentFolder.self;
    const newActionButtons = this.state.actionButtons;
    newActionButtons.filter(btn => btn.type === BTN_TYPE_BACK)[0].enabled = backBtnEnableState;
    this.setState({actionButtons: newActionButtons});
  }
  handleItemClick(item) {
    if (item.type === TYPE_FOLDER) {
      this.goToFolder(item._id);
    } else {
      // open pop-up with ability to edit file
      this.setState({
        selectedItem: item,
        showFileModal: true
      });
    }
  }
  handleItemEdit(item) {
    if (item.type === TYPE_FILE) {
      this.setState({
        showFileModal: true,
        selectedItem: item
      });
    } else {
      this.setState({
        showFolderModal: true,
        selectedItem: item
      });
    }
  }
  handleItemRemove(item)   {
    const {dispatch} = this.props;
    dispatch(deleteItem(item._id));
  }
  handleSave(data) {
    const {dispatch, currentFolder, user} = this.props;
    let payload = data;
    // set up correct parent ID depending on parent directory
    payload.parentId = currentFolder.self && currentFolder.self._id;
    if (payload._id) {
      dispatch(updateItem(payload));
    } else {
      dispatch(createItem(payload));
    }
    this.setState({showFileModal: false, showFolderModal: false});
  }
  handlePopupClose() {
    this.setState({showFileModal: false, showFolderModal: false});
  }
  goToFolder(folderId) {
    const {dispatch} = this.props;
    dispatch(getDocument(folderId));
  }
  handleBackToFolder() {
    const {currentFolder, dispatch} = this.props;
    if (currentFolder.self.userId) {
      dispatch(getDocument());
    } else {
      dispatch(getDocument(currentFolder.self.parentId));
    }
  }
  render() {
    if (!this.props.currentFolder) return null;
    const parentFolder = this.props.currentFolder.self;
    return (
      <div className="Home">
        <h3>{parentFolder ? parentFolder.name : 'Your workspace'}</h3>
        <ActionButtons buttons={this.state.actionButtons}></ActionButtons>
        <ListView items={this.props.currentFolder.children} onItemView={this.handleItemClick} onItemEdit={this.handleItemEdit} onItemRemove={this.handleItemRemove}></ListView>
        {this.state.showFolderModal && <FolderModal selectedItem={this.state.selectedItem} onSave={this.handleSave} onCancel={this.handlePopupClose}></FolderModal>}
        {this.state.showFileModal && <FileModal selectedItem={this.state.selectedItem} onSave={this.handleSave} onCancel={this.handlePopupClose}></FileModal>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentFolder: state.home.currentFolder,
    user: state.account.user
  };
}

export default connect(
  mapStateToProps
)(HomeContainer);
