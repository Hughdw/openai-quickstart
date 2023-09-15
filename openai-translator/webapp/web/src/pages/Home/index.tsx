import { Button, Select, Space, Typography, UploadProps } from 'antd';
import { Col, Row, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import style from './style.module.css';
import {
  LanguageEnum,
  LanguageLabelEnum,
  TargetFileFormatEnum,
  TranslatorStatusEnum,
  UploadStatusEnum
} from './enum';
import { useRequest } from 'ahooks';
import { fileTranslate, IFileProfile, viewFile } from './service';
import { forIn } from 'lodash';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { BaseOptionType } from 'antd/es/select';

const { Dragger } = Upload;
const { Title, Paragraph } = Typography;

const elementSize: SizeType = 'large';

const selectOptions: BaseOptionType[] = [];
forIn(LanguageEnum, function (value, key) {
  selectOptions.push({
    label: LanguageLabelEnum[value],
    value: key
  });
});

const TargetFormatOptions: BaseOptionType[] = [];
forIn(TargetFileFormatEnum, function (value, key) {
  TargetFormatOptions.push({
    label: key,
    value: value
  });
});

let file: IFileProfile;
const Home: React.FC = () => {
  // 常用的三个 Hook，组合使用

  // 文件上传的状态
  const [uploadState, setUploadState] = useState<UploadStatusEnum>(UploadStatusEnum.Init);
  // 文件翻译状态
  const [translatorState, setTranslatorState] = useState<TranslatorStatusEnum>(
    TranslatorStatusEnum.Init
  );
  // 要翻译的目标语言
  const [targetLanguageState, setTargetLanguageState] = useState<LanguageEnum>();

  // 要翻译的目标格式
  const [targetFormatState, setTargetFormatState] = useState<TargetFileFormatEnum>(
    TargetFileFormatEnum.Markdown
  );

  const props: UploadProps = {
    name: 'file',
    // multiple: false,
    accept: '.pdf',
    action: 'http://www.aaa.com:5000/api/v1/file',
    // className: "upload",
    onChange(info) {
      setUploadState(UploadStatusEnum.Uploading);
      // console.log(info);
      const { status, response } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        if (response.status === 0) {
          message.success(`${info.file.name} file uploaded successfully.`);
          setUploadState(UploadStatusEnum.Success);
          // console.log('response.data', response.data);
          const filename = response.data;
          const fileArr = filename.split('.');
          if (fileArr.length > 1) {
            file = {
              name: fileArr[0],
              type: fileArr[1]
            };
          }
        } else {
          message.error(response.msg);
          setUploadState(UploadStatusEnum.Fail);
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload fail.`);
        setUploadState(UploadStatusEnum.Fail);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    maxCount: 1
  };

  const { data, loading, run } = useRequest(fileTranslate, {
    manual: true,
    onSuccess: (result, params) => {
      setTranslatorState(TranslatorStatusEnum.Success);
    }
  });

  const onFormatChange = (value: TargetFileFormatEnum) => {
    setTargetFormatState(value);
  };

  const onLanguageChange = (value: LanguageEnum) => {
    setTargetLanguageState(value);
  };

  const jumpTo = () => {
    if (data?.data) {
      viewFile(data.data);
    }
  };

  return (
    <div className={style.main}>
      <div className={style.header}>
        <Title>
          <span className={style.title_1}>翻译 </span>
          <span className={style.title_2}>PDF</span>
        </Title>
        <Paragraph type="secondary">
          使用人工智能快速、准确的翻译你的资料，让知识触手可得！
        </Paragraph>
      </div>
      <div className={style.content}>
        <Row className={style.upload_wrap}>
          <Col sm={5} md={5} lg={5}></Col>
          <Col
            sm={14}
            md={14}
            lg={14}
            style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '10px' }}
          >
            <Dragger {...props} className={style.upload}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">单击或拖动文件到此区域</p>
            </Dragger>
            <Row className={style.operation}>
              <Col flex={1}>
                <Space wrap>
                  <Button
                    size={elementSize}
                    disabled={translatorState !== TranslatorStatusEnum.Success}
                    onClick={() => {
                      jumpTo();
                    }}
                  >
                    查看/下载
                  </Button>
                </Space>
              </Col>
              <Col flex={1} style={{ textAlign: 'right' }}>
                <Space wrap>
                  <Select
                    size={elementSize}
                    popupMatchSelectWidth={false}
                    placeholder="选择要翻译的格式"
                    onChange={onFormatChange}
                    options={TargetFormatOptions}
                    defaultValue={TargetFileFormatEnum.Markdown}
                  />

                  <Select
                    size={elementSize}
                    popupMatchSelectWidth={false}
                    showSearch
                    placeholder="选择要翻译的语言"
                    optionFilterProp="children"
                    onChange={onLanguageChange}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={selectOptions}
                  />
                  <Button
                    type="primary"
                    size={elementSize}
                    loading={loading}
                    disabled={
                      uploadState !== UploadStatusEnum.Success || targetLanguageState === undefined
                    }
                    onClick={() => run(file, targetFormatState, targetLanguageState)}
                  >
                    翻译
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col sm={5} md={5} lg={5}></Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
