import React, { useEffect, useState } from "react";
import { Button, Input, Form, Row, Col, Typography, Card, Spin } from 'antd';
import InfiniteScroll from "react-infinite-scroll-component";

const { Title } = Typography;


export default function App() {
  const [galleryImages, updateGalleryImages] = useState([]);
  const [pageIndex, updatePageIndex] = useState(1);
  const [query, setQuery] = useState(null);

  useEffect(() => {
    getPhotos();
  }, [pageIndex]);

  // if (!accessKey) {
  //   return (
  //     <div style={{ textAlign: 'center', padding: '50px' }}>
  //       <a href="https://unsplash.com/documentation" style={{ color: 'red' }}>
  //         Get your API key to run it in your own Environment
  //       </a>
  //     </div>
  //   );
  // }

  function queryPhotos(values) {
    setQuery(values.query);
    updatePageIndex(1);
    getPhotos();
  }

  function getPhotos() {
    let apiLink = `http://localhost:5000/api/photos?page=${pageIndex}`;
    if (query) {
      apiLink += `&query=${query}`;
    }
  
    fetch(apiLink)
      .then((res) => res.json())
      .then((data) => {
        if (pageIndex === 1) updateGalleryImages([]);
        const APIdata = !query ? data : data.results;
        updateGalleryImages((galleryImages) => [...galleryImages, ...APIdata]);
      });
  }
  

  return (
    <div style={{ padding: '20px' }}>
      <Title level={1} style={{ textAlign: 'center' }}>Image Gallery</Title>

      <Form onFinish={queryPhotos} layout="inline" style={{ marginBottom: '20px', justifyContent: 'center' }}>
        <Form.Item name="query" style={{ width: '300px' }}>
          <Input placeholder="Search" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Search</Button>
        </Form.Item>
      </Form>

      <InfiniteScroll
        dataLength={galleryImages.length}
        next={() => updatePageIndex((pageIndex) => pageIndex + 1)}
        hasMore={true}
        loader={<div style={{ textAlign: 'center', margin: '20px 0' }}><Spin /></div>}
      >
        <Row gutter={[16, 16]}>
          {galleryImages.map((image, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                cover={<img alt={image.alt_description} src={image.urls.regular} />}
                hoverable
              >
              </Card>
            </Col>
          ))}
        </Row>
      </InfiniteScroll>
    </div>
  );
}
