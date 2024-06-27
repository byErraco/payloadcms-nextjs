/**
 * v0 by Vercel.
 * @see https://v0.dev/t/MA5w7bjeEDh
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function UserOrdersTable({ orders }: { orders: any[] }) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState({ key: "orderNumber", order: "asc" })
  // const orders = [
  //   {
  //     orderNumber: "#1234",
  //     date: "2023-04-15",
  //     items: [
  //       { name: "Product A", quantity: 2, price: 19.99 },
  //       { name: "Product B", quantity: 1, price: 29.99 },
  //     ],
  //     total: 69.97,
  //     status: "Delivered",
  //     shippingAddress: {
  //       name: "John Doe",
  //       address: "123 Main St, Anytown USA",
  //       phone: "555-1234",
  //     },
  //     paymentMethod: "Visa ending in 1234",
  //   },
  //   {
  //     orderNumber: "#5678",
  //     date: "2023-03-20",
  //     items: [
  //       { name: "Product C", quantity: 1, price: 39.99 },
  //       { name: "Product D", quantity: 3, price: 14.99 },
  //     ],
  //     total: 89.96,
  //     status: "Shipped",
  //     shippingAddress: {
  //       name: "Jane Smith",
  //       address: "456 Oak Rd, Somewhere CA",
  //       phone: "555-5678",
  //     },
  //     paymentMethod: "MasterCard ending in 5678",
  //   },
  //   {
  //     orderNumber: "#9012",
  //     date: "2023-02-10",
  //     items: [{ name: "Product E", quantity: 1, price: 49.99 }],
  //     total: 49.99,
  //     status: "Cancelled",
  //     shippingAddress: {
  //       name: "Bob Johnson",
  //       address: "789 Pine St, Elsewhere NY",
  //       phone: "555-9012",
  //     },
  //     paymentMethod: "American Express ending in 9012",
  //   },
  // ]
  const filteredOrders = useMemo(() => {
    return orders
      .filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          order.date.toLowerCase().includes(search.toLowerCase()) ||
          // @ts-ignore
          order.items.some((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          ) ||
          order.total.toString().includes(search.toLowerCase()) ||
          order.status.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sort.order === "asc") {
          // @ts-ignore
          return a[sort.key] > b[sort.key] ? 1 : -1
        } else {
          // @ts-ignore
          return a[sort.key] < b[sort.key] ? 1 : -1
        }
      })
    // eslint-disable-next-line
  }, [search, sort])
  const [selectedOrder, setSelectedOrder] = useState(null)
  return (
    <div className="grid md:grid-cols-[1fr_300px] gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Order History</h1>
          <Input
            placeholder="Search orders..."
            className="flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() =>
                  setSort({
                    key: "orderNumber",
                    order:
                      sort.key === "orderNumber"
                        ? sort.order === "asc"
                          ? "desc"
                          : "asc"
                        : "asc",
                  })
                }
              >
                Order #
                {sort.key === "orderNumber" && (
                  <span className="ml-1">
                    {sort.order === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() =>
                  setSort({
                    key: "date",
                    order:
                      sort.key === "date"
                        ? sort.order === "asc"
                          ? "desc"
                          : "asc"
                        : "asc",
                  })
                }
              >
                Date
                {sort.key === "date" && (
                  <span className="ml-1">
                    {sort.order === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </TableHead>
              <TableHead>Items</TableHead>
              {/* <TableHead>Quantity</TableHead> */}
              <TableHead
                className="text-right cursor-pointer"
                onClick={() =>
                  setSort({
                    key: "total",
                    order:
                      sort.key === "total"
                        ? sort.order === "asc"
                          ? "desc"
                          : "asc"
                        : "asc",
                  })
                }
              >
                Total
                {sort.key === "total" && (
                  <span className="ml-1">
                    {sort.order === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() =>
                  setSort({
                    key: "status",
                    order:
                      sort.key === "status"
                        ? sort.order === "asc"
                          ? "desc"
                          : "asc"
                        : "asc",
                  })
                }
              >
                Status
                {sort.key === "status" && (
                  <span className="ml-1">
                    {sort.order === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow
                key={order.orderNumber}
                // @ts-ignore
                onClick={() => setSelectedOrder(order)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">
                  {order.orderNumber}
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  {/* @ts-ignore*/}
                  {order.items.map((item) => item.name).join(", ")}
                </TableCell>
                {/* <TableCell>
                  {order.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </TableCell> */}
                <TableCell className="text-right">
                  ${order.total.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    // @ts-ignore
                    variant={
                      order.status === "Delivered"
                        ? "success"
                        : order.status === "Shipped"
                        ? "info"
                        : "danger"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                {/* <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <MoveHorizontalIcon className="w-4 h-4" />
                    <span className="sr-only">Order actions</span>
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedOrder && (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-1">
                <div className="font-medium">Order Number</div>
                <div>
                  {/*  @ts-ignore */}
                  {selectedOrder.orderNumber}
                </div>
              </div>
              <div className="grid gap-1">
                <div className="font-medium">Order Date</div>
                {/* @ts-ignore */}
                <div>{selectedOrder.date}</div>
              </div>
              <div className="grid gap-1">
                <div className="font-medium">Shipping Address</div>
                <div>
                  {/*  @ts-ignore */}
                  {selectedOrder.shippingAddress.name}
                  <br />
                  {/*  @ts-ignore */}
                  {selectedOrder.shippingAddress.address}
                  <br />
                  {/*  @ts-ignore */}
                  {selectedOrder.shippingAddress.phone}
                </div>
              </div>
              <div className="grid gap-1">
                <div className="font-medium">Payment Method</div>
                {/*  @ts-ignore */}
                <div>{selectedOrder.paymentMethod}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Items Purchased</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/*  @ts-ignore */}
                  {selectedOrder.items.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        ${item.price.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// @ts-ignore
function MoveHorizontalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  )
}
