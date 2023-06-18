import {
  SmileOutlined,
  SolutionOutlined,
  SyncOutlined,
  FileTextOutlined,
  UploadOutlined,
  DownloadOutlined,
  RightOutlined
} from '@ant-design/icons';
import {Button, Card, Steps, Upload, UploadProps} from 'antd';
import './generator.scss'
// @ts-ignore
import React, {useState} from "react";
import axios from "axios";

function Generator() {

  let [current, setCurrent] = useState(0);
  let [cvFile, setCvFile] = useState<File>(null);
  let [competencyFile, setCompetencyFile] = useState<File>(null);

  const props: UploadProps = {
    beforeUpload: file => {
      return false;
    },
    multiple: false,
    maxCount: 1,
    listType: 'picture-card',
    onChange(info) {
      if (info.file.status !== 'uploading' && current == 0) {
        setCvFile(info.fileList[0].originFileObj);
      }
      if (info.file.status !== 'uploading' && current == 1) {
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

  if (current == 2 && cvFile != null && competencyFile != null) {
    onPost();
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
    console.log(current)
    setCurrent(current + 1);
  }

  function onPost() {
    axios.post('http://localhost:5000/generate', {
      cvFile: cvFile,
      competencyFile: competencyFile
    })
    .then(value => console.log(value))
    .catch(reason => console.error(reason));
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
          <Button type="primary" icon={<DownloadOutlined/>} size={'large'}/>
        </div>
    )
  }

}


export default Generator;