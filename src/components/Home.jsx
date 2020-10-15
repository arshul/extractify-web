import React from 'react';
import styled from 'styled-components';
import StorageService from '../services/storage.service';
import History from './History';

const MainContainer = styled.div`
  border-radius: 3px;
  background: cornflowerblue;
  padding: 12px;
  font-family: poppins;
  font-weight: 500;
  height: 100vh;
`;

const Header = styled.h1`
  text-align: center;
  color: white;
  font-size: 3rem !important;
`;

const InnerContainer = styled.div`
  border-radius: 5px;
  margin: 20px 10px;
  background: white;
  padding: 10px;
  max-height: 440px;
  overflow-y: scroll;
`;

const FileItem = styled.div`
  border-radius: 3px;
  background: #8080806b;
  height: 50px;
  font-size: 28px;
  fontweight: 500;
  padding: 15px;
  margin-bottom: 5px;
`;

const Divider = styled.div`
  margin-top: 3rem;
`;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploaded: [],
      processed: {},
    };
  }

  triggerInputFile = () => this.fileInput.click();

  addListener(name) {
    StorageService.db
      .collection(this.props.user)
      .doc(name)
      .onSnapshot((doc) => {
        console.log(doc.data());
        if (doc.data() !== undefined) {
          const { processed } = this.state;
          processed[name] = doc.data().text || 'No content found';
          this.setState({ processed });
        }
      });
  }

  handleChange(files) {
    console.log(files);
    let size = 0;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type === 'application/pdf') size += files[i].size;
    }
    this.setState({ files, size });
  }

  async submit() {
    this.setState({ uploading: true });
    for (let i = 0; i < this.state.files.length; i++) {
      const resp = await StorageService.uploadFile(this.state.files[i], this.props.user);
      console.log(this.state.uploaded);
      this.setState({ uploaded: [...this.state.uploaded, resp.metadata.name] }, () => {
        this.addListener(resp.metadata.name);
      });
    }
  }

  render() {
    const { files, size, uploading, uploaded, processed } = this.state;
    return (
      <MainContainer>
        <Header> Extractify - from Speechify</Header>
        <Divider />
        {files.length > 0 || <History {...this.props} />}
        <Divider />
        <InnerContainer>
          {files.length > 0 || (
            <div>
              <h3>No file Selected</h3>
            </div>
          )}
          <input
            className="ui input"
            type="file"
            style={{ display: 'none' }}
            accept="application/pdf"
            multiple
            ref={(fileInput) => (this.fileInput = fileInput)}
            onChange={({ target: { files } }) => {
              const validFiles = [...files].filter((f) => f.type === 'application/pdf');
              this.handleChange(validFiles);
            }}
          />
          {files &&
            files.map((file, i) => {
              return (
                <>
                  {processed[file.name] ? (
                    <div
                      className="ui justified container"
                      style={{ marginBottom: '5px', padding: '10px', borderBottom: '2px solid grey', fontSize: '18px' }}
                    >
                      <h4 className="ui header"> {file.name} </h4>
                      {processed[file.name]}
                    </div>
                  ) : (
                    <FileItem key={i}>
                      <i className="file icon" />{' '}
                      {uploaded.includes(file.name)
                        ? 'Processing...'
                        : file.name.length > 35
                        ? `${file.name.substr(0, 35)}...`
                        : file.name}
                      {uploading ? (
                        uploaded.includes(file.name) ? (
                          <i className="green check icon" style={{ float: 'right', fontSize: '16px' }} />
                        ) : (
                          <i className="spinner loading icon" style={{ float: 'right', fontSize: '16px' }} />
                        )
                      ) : (
                        <div style={{ float: 'right', fontSize: '16px' }}>
                          {(file.size / 1024 / 1024).toFixed(2)} Mb
                        </div>
                      )}
                    </FileItem>
                  )}
                </>
              );
            })}
        </InnerContainer>
        {!uploading && !uploaded.length > 0 && (
          <div style={{ textAlign: 'center' }}>
            {!files.length ? (
              <button type="submit" className="ui black button " onClick={this.triggerInputFile}>
                {' '}
                Choose Files{' '}
              </button>
            ) : (
              <button type="submit" className="ui green button " onClick={() => this.submit()}>
                {' '}
                Upload {files.length} files ({(size / 1024 / 1024).toFixed(2)} Mb)
              </button>
            )}
          </div>
        )}
      </MainContainer>
    );
  }
}
