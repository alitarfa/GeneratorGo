import {
  DownloadOutlined,
  FileTextOutlined,
  SmileOutlined,
  SolutionOutlined,
  SyncOutlined,
  UploadOutlined
} from '@ant-design/icons';
import {Button, Card, Steps, Upload, UploadProps} from 'antd';
import './generator.scss'
// @ts-ignore
import React, {useState} from "react";
import axios from "axios";
import ReactPDF, {Document, Page, pdf, Text} from "@react-pdf/renderer";
import {saveAs} from 'file-saver';

function Generator() {

  let [current, setCurrent] = useState(0);
  let [cvFile, setCvFile] = useState<File>(null);
  let [competencyFile, setCompetencyFile] = useState<File>(null);
  let [content, setContent] = useState();
  const CV_STEP: number = 0;
  const COMPETENCY_STEP: number = 1;
  const GENERATOR_STEP: number = 2;
  const DOWNLOAD_STEP: number = 3;

  const MyPDFDocument = () => (
      <Document>
        <Page>
          <Text>{content}</Text>
        </Page>
      </Document>
  );


  const props: UploadProps = {
    beforeUpload: file => {
      return false;
    },
    multiple: false,
    maxCount: 1,
    listType: 'picture-card',
    onChange(info) {
      if (info.file.status !== 'uploading' && current == CV_STEP) {
        setCvFile(info.fileList[0].originFileObj);
      }
      if (info.file.status !== 'uploading' && current == COMPETENCY_STEP) {
        setCompetencyFile(info.fileList[0].originFileObj);
      }
    },
  };

  const steps = [
    CvUploaderStep(props),
    CompetencyUploaderStep(props),
    GeneratorStep(),
    DownloaderStep()
  ]

  if (current == GENERATOR_STEP && cvFile != null && competencyFile != null) {
    onPost();
  }

  function onDownload() {
    let asPdf = pdf(<MyPDFDocument/>).toBlob();
    asPdf.then(value => {
      saveAs(value, "CV.pdf");
    })
  }

  return (
      <div className="container">
        <Card bordered={false}
              style={{width: 1200, height: 400}}>
          <div>
            <Steps onChange={setCurrent} current={current}
                   items={[
                     {
                       title: 'CV file',
                       icon: <SolutionOutlined/>,
                     },
                     {
                       title: 'Competency file',
                       icon: <FileTextOutlined/>,
                     },
                     {
                       title: 'Generating',
                       icon: <SyncOutlined spin/>,
                     },
                     {
                       title: 'Done',
                       icon: <SmileOutlined/>,
                     },
                   ]}
            />
            <div className="stepper-container">
              {steps[current]}
            </div>
          </div>
        </Card>
      </div>
  )

  function onNext() {
    if (!!cvFile) {
      setCurrent(current + 1);
    }
  }

  function onPost() {
    let formData = new FormData();
    formData.append('cvFile', cvFile);
    formData.append('competencyFile', competencyFile);
    axios.post('http://localhost:8080/completion', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => {
      setContent(res.data.choices[0]?.message?.content);
      setCurrent(current + 1);
    })
    .catch(err => {
      console.log(err);
    });
  }

  function CvUploaderStep(props: UploadProps) {
    return (
        <div className="container-element">
          <h2>Yoo there, Drop your CV file 👻</h2>
          <Upload {...props}>
            <UploadOutlined style={{fontSize: 20}}/>
          </Upload>
          <Button onClick={onNext} shape={"default"} type="primary" size={'small'}>
            <span>Next</span>
          </Button>
        </div>
    )
  }

  function CompetencyUploaderStep(props: UploadProps) {
    return (
        <div className="container-element">
          <h2>Of sure, Drop your competency model also 🤪</h2>
          <Upload {...props}>
            <UploadOutlined style={{fontSize: 20}}/>
          </Upload>
          <Button onClick={onNext} shape={"default"} type="primary" size={'small'}>
            <span>Next</span>
          </Button>
        </div>
    )
  }

  function GeneratorStep() {
    return (
        <div>
          <h1>Generating file in progress... 🙈</h1>
        </div>
    )
  }

  function DownloaderStep() {
    return (
        <div className="container-element">
          <h1>Congrats, your file is ready... 😉</h1>
          <Button type="primary" icon={<DownloadOutlined/>} size={'large'} onClick={onDownload}/>
        </div>
    )
  }

}


export default Generator;