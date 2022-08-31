// Libraries
import React, { useState, useEffect } from "react";
import { Avatar, Button, List, PageHeader, Select, Skeleton, Row, Col, Card } from 'antd';
import axios from "axios";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import IItem from '../schemas/Item'

const { Option } = Select;

// Schemas
type Props = {}

const ProductListing: React.FC<Props> = () => {
    const [filteredData, setFilteredData] = useState([])

    const [data, setData] = useState([])
    const [initLoading, setInitLoading] = useState(true);
    const [colors, setColors] = useState([]);
    const [cart, setCart]: any = useState({
        products: [],
        totalPrice: 0
    });

    useEffect(() => {
        axios.get(`https://my-json-server.typicode.com/benirvingplt/products/products`).then(response => {
            if (response.data && response.data.length) {
                let colors: any = []

                response.data.map((item: IItem) => {
                    if (!colors.includes(item.colour)) {
                        colors.push(item.colour)
                    }
                })
                setData(response.data)
                setFilteredData(response.data)
                setInitLoading(false)
                setColors(colors)
            }
        }).catch(err => console.log(err))
    }, [])

    const handleChange = (color: String) => {
        if (color === "All") {
            setFilteredData(data)
        } else {
            let filteredData = data.filter((item: IItem) => item.colour === color)
            setFilteredData(filteredData)
        }
    }

    const handleQtyChange = (product: IItem, action: string) => {
        if (action === "add") {
            let index = cart.products.findIndex((item: any) => item.id === product.id)
            if (index > -1) {
                cart.products[index].qty = cart.products[index].qty + 1
                cart.totalPrice = cart.totalPrice + product.price
            } else {
                cart.products.push({
                    id: product.id,
                    qty: 1,
                    price: product.price
                })
                cart.totalPrice = cart.totalPrice + product.price
            }
        } else {
            let index = cart.products.findIndex((item: any) => item.id === product.id)
            if (index > -1) {
                cart.products[index].qty = cart.products[index].qty - 1
                cart.totalPrice = cart.totalPrice - product.price
                if (cart.products[index].qty === 0) {
                    cart.products.splice(index, 1)
                }
            }
        }
        console.log(cart)
        setCart({ ...cart })
    }
    const handleRemoveItem = (id: number) => {
        let index = cart.products.findIndex((item: any) => item.id === id)
        if (index > -1) {
            cart.totalPrice = cart.totalPrice - (cart.products[index].qty * cart.products[index].price)
            cart.totalPrice = Math.abs(cart.totalPrice)
            cart.products.splice(index, 1)
        }
        setCart({ ...cart })
    }

    const getQuantity = (id: number) => {
        let item = cart.products.find((item: any) => item.id === id)
        if (item) {
            return item.qty
        } else {
            return 0
        }
    }

    return (
        <>
            <PageHeader
                className="site-page-header"
                // onBack={() => null}
                title="Products"
                subTitle="List of all products"

            />
            <Row>
                <Col xs={1} sm={1} md={3} lg={3} xl={6}></Col>
                <Col xs={22} sm={22} md={18} lg={18} xl={12}>
                    <Card
                        style={{ borderRadius: 30, boxShadow: '3px 3px 5px 5px lightgrey', paddingBottom: 20 }}
                        extra={[
                            <Select
                                defaultValue="All"
                                placeholder="Color Filter"
                                style={{
                                    width: 250,
                                }}
                                onChange={handleChange}
                            >
                                <Option key={"All"} value={"All"}>{"All"}</Option>
                                {colors.map((item: string) => {

                                    return <Option key={item} value={item}>{item}</Option>
                                })}
                            </Select>
                        ]}
                        actions={[
                            <div style={{ float: "right", paddingRight: 20 }}>
                                <h2>£Total: {parseFloat(cart.totalPrice).toFixed(2)}</h2>
                            </div>
                        ]}
                    >
                        <List
                            // className="demo-loadmore-list"
                            style={{ margin: "auto" }}
                            loading={initLoading}
                            itemLayout="horizontal"
                            dataSource={filteredData}
                            renderItem={(item: IItem) => {
                                return (
                                    <List.Item
                                        key={item.id}
                                        actions={[]}
                                    >
                                        <Skeleton avatar title={false} loading={initLoading} active>
                                            <List.Item.Meta
                                                avatar={<Avatar src={item.img} size={"large"} />}
                                                title={item.name}
                                                description={`£${item.price}`}
                                            />
                                            <div>

                                                <MinusOutlined translate={"button"} onClick={(e: any) => {
                                                    handleQtyChange(item, "remove")
                                                }} />

                                                <h3 style={{ display: "inline", margin: 15 }}>
                                                    {getQuantity(item.id)}
                                                </h3>

                                                <PlusOutlined translate={"button"} onClick={() => {
                                                    handleQtyChange(item, "add")
                                                }} />

                                                <div>

                                                    <a style={{ textDecoration: "none", color: "black" }}
                                                        onClick={(e: any) => {
                                                            e.preventDefault()
                                                            handleRemoveItem(item.id)
                                                        }}
                                                    >Remove</a>
                                                </div>
                                            </div>
                                        </Skeleton>
                                    </List.Item>
                                )
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )

}

export default ProductListing;