import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import StorageService from '../services/storage.service';

const HistoryContainer = styled.div`
  border-radius: 5px;
  margin: 20px 10px;
  background: #cecaca;
  padding: 10px;
`;
const FileContainer = styled.div`
  max-height: 240px;
  overflow-y: scroll;
`;
const FileItem = styled.div`
  border-radius: 3px;
  padding: 5px;
  border: 1px solid white;
  font-size: 16px;
  margin-bottom: 5px;
`;
const History = (props) => {
  const [previousDocs, setPreviousDocs] = useState([]);

  useEffect(() => {
    const docs = [];
    StorageService.db
      .collection(props.user)
      .get()
      .then((snapshot) => {
        console.log(snapshot.size);
        snapshot.forEach((doc) => {
          docs.push(doc.id);
        });
        setPreviousDocs(docs);
      });
  }, [props.user]);

  return (
    <HistoryContainer>
      <h3 className="ui header">
        <i className="history icon" />
        <div className="content">
          History<div className="sub header">Previously uploaded files</div>
        </div>
      </h3>
      <FileContainer>
        {previousDocs.map((doc) => (
          <FileItem>{doc}</FileItem>
        ))}
        {previousDocs.length > 0 || <div>No previous Documents found.</div>}
      </FileContainer>
    </HistoryContainer>
  );
};

export default History;
