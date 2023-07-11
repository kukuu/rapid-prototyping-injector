import { useEffect, useState, useRef } from "react";
import router from "next/router";
import { AppProps } from "next/app";

import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import {
  Skeleton,
  Upload,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Spin,
  InputRef,
  UploadProps,
} from "antd";
import type { ColumnsType, ColumnType, TableProps } from "antd/es/table";
import type {
  ExpandableConfig,
  TableRowSelection,
  FilterConfirmProps,
} from "antd/es/table/interface";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import axios from "axios";
import { set } from "react-hook-form";

const { TextArea } = Input;

const schema = {
  title: "Upload meida",
  fields: [
    {
      key: "title",
      label: "Title",
      type: "text",
      rules: [{ required: true, message: "Please enter title" }],
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      rules: [{ required: true, message: "Please enter description" }],
    },
    {
      key: "files",
      label: "Media",
      type: "file",
      rules: [{ required: true, message: "" }],
    },
  ],
};

import { gql, useMutation, useQuery } from "@apollo/client";

const CREATE_MEDIA = gql`
  mutation CreateMedia(
    $title: String!
    $description: String!
    $url: String!
    $mediaType: String!
  ) {
    createMedia(
      title: $title
      description: $description
      url: $url
      mediaType: $mediaType
    ) {
      id
    }
  }
`;

const GET_MEDIA = gql`
  query GetAllMedia {
    getAllMedia {
      description
      id
      mediaType
      title
      url
    }
  }
`;

const UploadPage = () => {
  const [modal1Open, setModal1Open] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [createMedia, { loading: uploading, error, data }] =
    useMutation(CREATE_MEDIA);

  const {
    loading: mediaLoading,
    error: mediaError,
    data: allMedia,
  } = useQuery(GET_MEDIA);

  const onFormSubmit = async (values) => {
    console.log("Media upload form values:", values);

    await createMedia({
      variables: {
        title: values.title,
        description: values.description,
        url: values.files[0].imageId,
        mediaType: "IMAGE",
      },
    });
    toast.success("Media saved successfully!", {
      autoClose: 1000,
    });
  };

  return (
    <>
      <div className="container w-full  bg-gray-600">
        <h6 className="p-2 text-gray-100 text-lg font-semibold">
          Upload Media
        </h6>
        <hr />
      </div>
      <div className=" flex flex-col md:flex-row gap-2 p-2 container w-full bg-yellow-50">
        <div className="h-auto bg-yellow-50 p-2 md:w-1/3 border-2 border-yellow-300 rounded-lg">
          <Spin spinning={uploading}>
            <MediaUploadForm formSchema={schema} onFormSubmit={onFormSubmit} />
          </Spin>
        </div>
        <div className="pt-2 w-full  h-screen  overflow-auto">
          <div className="grid grid-cols-4 gap-4">
            {allMedia?.getAllMedia?.map((media) => (
              <>
                <div className="max-w-sm w-64 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <div className="h-64 p-0 flex flex-row items-center justify-center">
                    {media.mediaType === "VIDEO" ? (
                      <iframe
                        src="https://drive.google.com/file/d/1zxND_AI2QkvE6epz8VYJfC_mbzdIVdxQ/preview"
                        width="250"
                        height="250"
                        allow="autoplay"
                      ></iframe>
                    ) : (
                      <img
                        className="rounded-t-lg p-0 object-cover h-64 w-64"
                        src={`https://drive.google.com/uc?export=view&id=${media.url}`}
                        alt=""
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h6 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">
                      {media.title}
                    </h6>
                    <p className="mb-3 font-normal text-xs text-gray-700 dark:text-gray-400">
                      {media.description}
                    </p>
                    <Button
                      type="primary"
                      className="bg-blue-500"
                      onClick={() => {
                        setModal1Open(true);
                        setSelectedMedia(media);
                      }}
                    >
                      View Preview
                    </Button>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>

      <Modal
        title="Media Preview"
        style={{ top: 20 }}
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        width={1000}
        footer={null}
      >
        <div className="flex flex-col sm:flex-row  h-96 py-4">
          <div>
            {selectedMedia?.mediaType === "VIDEO" ? (
              <>
                <iframe
                  src="https://drive.google.com/file/d/1zxND_AI2QkvE6epz8VYJfC_mbzdIVdxQ/preview"
                  width="440"
                  height="300"
                  allow="autoplay"
                ></iframe>
              </>
            ) : (
              <>
                <img
                  className="rounded-lg p-0 object-cover h-72 w-72"
                  src={`https://drive.google.com/uc?export=view&id=${selectedMedia?.url}`}
                  alt=""
                />
              </>
            )}
          </div>
          <div className="p-3 ml-4">
            <h6 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {selectedMedia?.title}
            </h6>
            <p className="mb-3 font-normal text-xs text-gray-700 dark:text-gray-400">
              {selectedMedia?.description}
            </p>
          </div>
        </div>
        {/* <pre>{JSON.stringify(selectedMedia, null, 2)}</pre> */}
      </Modal>
    </>
  );
};

export default UploadPage;

const MediaUploadForm = ({ formSchema, onFormSubmit }) => {
  const [form] = Form.useForm();

  const handleFormSubmit = (values) => {
    console.log("Form values from modal form", values);
    onFormSubmit(values);
  };

  return (
    <>
      <MyForm formSchema={formSchema} handleFormSubmit={handleFormSubmit} />
    </>
  );
};

const MyForm = ({
  formSchema,
  handleFormSubmit,
  dd = null,
  initialValues = null,
}) => {
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleFileChange: UploadProps["onChange"] = async (info) => {
    const file = info.file;
    console.log("File:", file);

    const existingFileIndex = fileList.findIndex((f) => f.uid === file.uid);
    if (existingFileIndex !== -1) {
      console.log("File already uploaded");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file.originFileObj);
      formData.append("uid", file.uid);
      const config = {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: (event) => {
          console.log(
            `Current progress:`,
            Math.round((event.loaded * 100) / event.total)
          );
        },
      };
      const response = await axios.post("/api/upload", formData, config);

      // const index = newFileList.findIndex((f) => f.uid === response.data.uid);
      // newFileList[index] = {
      //   ...newFileList[index],
      //   url:
      //     "https://drive.google.com/uc?export=view&id=" + response.data.imageId,
      //   thumbUrl:
      //     "https://drive.google.com/uc?export=view&id=" + response.data.imageId,
      //   status: "done",
      // };

      // setFileList(newFileList);

      const newFileList = [...fileList];
      newFileList.push({
        ...file,
        url:
          "https://drive.google.com/uc?export=view&id=" + response.data.imageId,
        thumbUrl:
          "https://drive.google.com/uc?export=view&id=" + response.data.imageId,
        status: "done",
      });

      setFileList(newFileList);
      const filesToUpload = newFileList.map((f) => {
        return {
          id: f.uid,
          imageId: response.data.imageId,
          name: f.name,
        };
      });
      form.setFieldsValue({ files: filesToUpload });
    } catch (error) {
      console.error(error);
      console.log("Error uploading file");
    }
  };
  const props = {
    onChange: handleFileChange,
    multiple: false,
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFormSubmit}
      >
        {formSchema?.fields.map((fld) => {
          if (fld.key !== "action") {
            switch (fld.type) {
              case "number":
                return (
                  <Form.Item
                    name={fld.key}
                    label={fld.label}
                    rules={[
                      { required: true, message: `Please enter ${fld.key}` },
                    ]}
                  >
                    <InputNumber
                      onChange={() => {
                        if (fld.onChange) {
                          const val = fld.onChange.formula(form.getFieldsValue);
                          form.setFieldValue(fld.onChange.targetKey, 2234);
                        }
                      }}
                      placeholder={`Please enter ${fld.key}`}
                    />
                  </Form.Item>
                );
              case "text":
                return (
                  <Form.Item
                    name={fld.key}
                    label={fld.label}
                    rules={[
                      { required: true, message: `Please enter ${fld.key}` },
                    ]}
                  >
                    <Input placeholder={`Please enter ${fld.key}`} />
                  </Form.Item>
                );
              case "textarea":
                return (
                  <Form.Item
                    name={fld.key}
                    label={fld.label}
                    rules={[
                      { required: true, message: `Please enter ${fld.key}` },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder={`Please enter ${fld.key}`}
                    />
                  </Form.Item>
                );
              case "select":
                return (
                  <Form.Item
                    name={fld.key}
                    label={fld.label}
                    rules={[
                      { required: true, message: `Please enter ${fld.key}` },
                    ]}
                  >
                    <Select placeholder={`Please enter ${fld.key}`}>
                      {fld.options.map((opt, index) => (
                        <Select.Option key={index} value={opt.value}>
                          {opt.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
              case "server-select":
                return (
                  <Form.Item
                    name={fld.key}
                    label={fld.label}
                    rules={[
                      { required: true, message: `Please enter ${fld.key}` },
                    ]}
                  >
                    {/* <Select placeholder={`Please enter ${fld.key}`}>
                          {fld.options.map((opt) => (
                            <Option value={opt.value}>{opt.label}</Option>
                          ))}
                        </Select> */}
                    <Select placeholder={`Please enter ${fld.key}`}>
                      {dd?.[fld.optionsConfig.queryKey]?.map((opt, index) => (
                        <Select.Option key={index} value={opt.value}>
                          {opt.label || ""}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
              case "date":
                return (
                  <Form.Item
                    name={fld.key}
                    label={fld.label}
                    rules={[
                      { required: true, message: `Please enter ${fld.key}` },
                    ]}
                  >
                    <DatePicker placeholder={`Please enter ${fld.key}`} />
                  </Form.Item>
                );

              case "file":
                return (
                  <Form.Item
                    name={fld.key}
                    label={fld.label}
                    rules={[
                      {
                        required: false,
                        message: ``,
                      },
                    ]}
                  >
                    <Upload
                      {...props}
                      fileList={fileList}
                      listType="picture-card"
                    >
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                  </Form.Item>
                );

              default:
                return (
                  <Form.Item
                    name={fld.key}
                    label={fld.label}
                    rules={[
                      {
                        required: true,
                        message: `Please enter ${fld.key}`,
                      },
                    ]}
                  >
                    <Input placeholder={`Please enter ${fld.key}`} />
                  </Form.Item>
                );
            }
          }
        })}
        <Form.Item>
          <Button type="primary" className="bg-blue-500" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
