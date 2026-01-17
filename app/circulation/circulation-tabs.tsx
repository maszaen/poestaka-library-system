"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { BorrowTab } from "./borrow-tab";
import { ReturnTab } from "./return-tab";
import { CardContent } from "@/components/ui/card";

export function CirculationTabs() {
  return (
    <Tabs defaultValue="borrow" className="w-full">
      <CardContent className="p-0">

      <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="borrow" className="gap-2">
          <ArrowDownToLine className="h-4 w-4" />
          Peminjaman
        </TabsTrigger>
        <TabsTrigger value="return" className="gap-2">
          <ArrowUpFromLine className="h-4 w-4" />
          Pengembalian
        </TabsTrigger>
      </TabsList>
      </CardContent>

      <TabsContent value="borrow">
        <BorrowTab />
      </TabsContent>

      <TabsContent value="return">
        <ReturnTab />
      </TabsContent>
    </Tabs>
  );
}
