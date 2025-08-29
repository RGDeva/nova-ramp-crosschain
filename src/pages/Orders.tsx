import { useState } from "react";
import { RefreshCw, ExternalLink, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import IntentStatus from "@/components/IntentStatus";
import ProofDebugger from "@/components/ProofDebugger";

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const mockOrders = [
    {
      id: "1",
      type: "Onramp",
      amount: "$100.00",
      currency: "USDC",
      provider: "Venmo", 
      status: "pending_proof",
      timestamp: "2024-01-15T10:30:00Z",
      txHash: null,
    },
    {
      id: "2", 
      type: "Onramp",
      amount: "$50.00",
      currency: "USDC",
      provider: "Cash App",
      status: "completed",
      timestamp: "2024-01-14T15:45:00Z", 
      txHash: "0x1234...5678",
    },
    {
      id: "3",
      type: "Offramp", 
      amount: "200.00 USDC",
      currency: "USD",
      provider: "Maker Deposit",
      status: "failed",
      timestamp: "2024-01-13T09:15:00Z",
      txHash: null,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-nova-success" />;
      case "pending_proof":
      case "pending_auth":
        return <Clock className="h-4 w-4 text-nova-warning" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-nova-error" />;
      default:
        return <RefreshCw className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending_proof":
      case "pending_auth":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleViewOrder = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Orders</h1>
          <p className="text-muted-foreground">
            Track your on-ramp and off-ramp transactions
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {mockOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className="bg-gradient-surface border-border/50 hover:border-primary/20 transition-colors duration-nova animate-fade-in cursor-pointer"
                  onClick={() => handleViewOrder(order.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{order.type}</span>
                              <Badge variant={getStatusVariant(order.status)}>
                                {order.status.replace("_", " ").toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {order.amount} via {order.provider}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {order.txHash && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>View Tx</span>
                          </Button>
                        )}
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Date(order.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Similar TabsContent for pending, completed, failed with filtered orders */}
          <TabsContent value="pending" className="space-y-4 mt-6">
            <div className="text-center py-8 text-muted-foreground">
              Filtered view for pending orders would go here
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            <div className="text-center py-8 text-muted-foreground">
              Filtered view for completed orders would go here
            </div>
          </TabsContent>

          <TabsContent value="failed" className="space-y-4 mt-6">
            <div className="text-center py-8 text-muted-foreground">
              Filtered view for failed orders would go here
            </div>
          </TabsContent>
        </Tabs>

        {/* Order Detail Modal/Panel */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-background border-border max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order Details - {selectedOrder}</CardTitle>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setSelectedOrder(null)}
                  >
                    ✕
                  </Button>
                </div>
                <CardDescription>
                  View order status and perform actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <IntentStatus orderId={selectedOrder} />
                <ProofDebugger orderId={selectedOrder} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;