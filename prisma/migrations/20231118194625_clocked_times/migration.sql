-- CreateTable
CREATE TABLE "ClockedTime" (
    "id" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "ClockedTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClockedTimeGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ClockedTimeGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClockedTime" ADD CONSTRAINT "ClockedTime_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ClockedTimeGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClockedTime" ADD CONSTRAINT "ClockedTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClockedTimeGroup" ADD CONSTRAINT "ClockedTimeGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
