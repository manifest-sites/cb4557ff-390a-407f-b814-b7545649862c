import { useState, useEffect } from 'react'
import { Card, Button, Input, Select, Modal, Form, message, Spin, Row, Col, Tag, Typography, Space } from 'antd'
import { HeartOutlined, HeartFilled, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Dog } from '../entities/Dog'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

function DogApp() {
  const [dogs, setDogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sizeFilter, setSizeFilter] = useState('all')
  const [form] = Form.useForm()

  const popularBreeds = [
    { breed: 'Golden Retriever', size: 'large', temperament: 'Friendly, Intelligent, Devoted', imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop' },
    { breed: 'Labrador Retriever', size: 'large', temperament: 'Outgoing, Active, Friendly', imageUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=200&fit=crop' },
    { breed: 'German Shepherd', size: 'large', temperament: 'Confident, Courageous, Smart', imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=300&h=200&fit=crop' },
    { breed: 'French Bulldog', size: 'small', temperament: 'Adaptable, Playful, Smart', imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop' },
    { breed: 'Beagle', size: 'medium', temperament: 'Friendly, Curious, Merry', imageUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=300&h=200&fit=crop' },
    { breed: 'Poodle', size: 'medium', temperament: 'Active, Alert, Intelligent', imageUrl: 'https://images.unsplash.com/photo-1616190264687-b7ebf7aa958a?w=300&h=200&fit=crop' }
  ]

  useEffect(() => {
    loadDogs()
  }, [])

  const loadDogs = async () => {
    setLoading(true)
    try {
      const response = await Dog.list()
      if (response.success) {
        setDogs(response.data || [])
      }
    } catch (error) {
      message.error('Failed to load dogs')
    } finally {
      setLoading(false)
    }
  }

  const handleAddDog = async (values) => {
    try {
      const response = await Dog.create({
        ...values,
        isFavorite: false
      })
      if (response.success) {
        message.success('Dog added successfully!')
        setIsModalVisible(false)
        form.resetFields()
        loadDogs()
      }
    } catch (error) {
      message.error('Failed to add dog')
    }
  }

  const toggleFavorite = async (dog) => {
    try {
      const response = await Dog.update(dog._id, {
        ...dog,
        isFavorite: !dog.isFavorite
      })
      if (response.success) {
        loadDogs()
      }
    } catch (error) {
      message.error('Failed to update favorite status')
    }
  }

  const addPopularDog = async (breedInfo) => {
    try {
      const response = await Dog.create({
        name: `Beautiful ${breedInfo.breed}`,
        breed: breedInfo.breed,
        size: breedInfo.size,
        temperament: breedInfo.temperament,
        imageUrl: breedInfo.imageUrl,
        description: `A wonderful ${breedInfo.breed} looking for a loving home.`,
        age: Math.floor(Math.random() * 8) + 1,
        isFavorite: false
      })
      if (response.success) {
        message.success(`${breedInfo.breed} added!`)
        loadDogs()
      }
    } catch (error) {
      message.error('Failed to add dog')
    }
  }

  const filteredDogs = dogs.filter(dog => {
    const matchesSearch = dog.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dog.breed?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSize = sizeFilter === 'all' || dog.size === sizeFilter
    return matchesSearch && matchesSize
  })

  const getSizeColor = (size) => {
    switch (size) {
      case 'small': return 'blue'
      case 'medium': return 'orange'
      case 'large': return 'red'
      default: return 'default'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
          🐕 Dog Lover's App
        </Title>
        <Text className="text-lg text-gray-600">
          Discover, collect, and learn about amazing dog breeds
        </Text>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-wrap">
          <Input
            placeholder="Search dogs by name or breed..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select
            value={sizeFilter}
            onChange={setSizeFilter}
            className="w-32"
          >
            <Option value="all">All Sizes</Option>
            <Option value="small">Small</Option>
            <Option value="medium">Medium</Option>
            <Option value="large">Large</Option>
          </Select>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          size="large"
        >
          Add Your Dog
        </Button>
      </div>

      {dogs.length === 0 && !loading && (
        <div className="text-center py-12">
          <Title level={3} className="text-gray-500 mb-6">
            Welcome to your dog collection!
          </Title>
          <Paragraph className="text-gray-600 mb-8">
            Start by adding some popular dog breeds or create your own custom dogs.
          </Paragraph>
          
          <div className="mb-8">
            <Title level={4} className="mb-4">Popular Dog Breeds</Title>
            <Row gutter={[16, 16]} justify="center">
              {popularBreeds.map((breed, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Card
                    hoverable
                    cover={<img alt={breed.breed} src={breed.imageUrl} className="h-32 object-cover" />}
                    actions={[
                      <Button
                        type="link"
                        onClick={() => addPopularDog(breed)}
                        className="text-blue-600"
                      >
                        Add to Collection
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={breed.breed}
                      description={
                        <div>
                          <Tag color={getSizeColor(breed.size)}>{breed.size}</Tag>
                          <Text className="text-xs text-gray-500 mt-1 block">
                            {breed.temperament}
                          </Text>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {filteredDogs.map((dog) => (
            <Col xs={24} sm={12} md={8} lg={6} key={dog._id}>
              <Card
                hoverable
                cover={
                  dog.imageUrl ? (
                    <img
                      alt={dog.name}
                      src={dog.imageUrl}
                      className="h-48 object-cover"
                    />
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <Text className="text-6xl">🐕</Text>
                    </div>
                  )
                }
                actions={[
                  <Button
                    type="text"
                    icon={dog.isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                    onClick={() => toggleFavorite(dog)}
                  >
                    {dog.isFavorite ? 'Favorited' : 'Favorite'}
                  </Button>
                ]}
              >
                <Card.Meta
                  title={
                    <div className="flex items-center justify-between">
                      <Text strong className="text-lg">{dog.name}</Text>
                      {dog.isFavorite && <HeartFilled style={{ color: '#ff4d4f' }} />}
                    </div>
                  }
                  description={
                    <div>
                      <div className="mb-2">
                        <Text strong>Breed:</Text> {dog.breed}
                      </div>
                      {dog.age && (
                        <div className="mb-2">
                          <Text strong>Age:</Text> {dog.age} years old
                        </div>
                      )}
                      {dog.size && (
                        <div className="mb-2">
                          <Tag color={getSizeColor(dog.size)}>{dog.size}</Tag>
                        </div>
                      )}
                      {dog.temperament && (
                        <div className="mb-2">
                          <Text className="text-xs text-gray-600">{dog.temperament}</Text>
                        </div>
                      )}
                      {dog.description && (
                        <Paragraph ellipsis={{ rows: 2 }} className="text-sm text-gray-600 mt-2">
                          {dog.description}
                        </Paragraph>
                      )}
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

      <Modal
        title="Add a New Dog"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        okText="Add Dog"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddDog}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the dog\'s name' }]}
          >
            <Input placeholder="Enter dog's name" />
          </Form.Item>

          <Form.Item
            label="Breed"
            name="breed"
            rules={[{ required: true, message: 'Please enter the dog\'s breed' }]}
          >
            <Input placeholder="Enter dog's breed" />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
          >
            <Input type="number" placeholder="Enter dog's age in years" />
          </Form.Item>

          <Form.Item
            label="Size"
            name="size"
          >
            <Select placeholder="Select size">
              <Option value="small">Small</Option>
              <Option value="medium">Medium</Option>
              <Option value="large">Large</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Temperament"
            name="temperament"
          >
            <Input placeholder="e.g. Friendly, Energetic, Loyal" />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="imageUrl"
          >
            <Input placeholder="Enter image URL (optional)" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea
              rows={3}
              placeholder="Tell us about this dog..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DogApp