import express from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const app = express();

app.post('/hooks/catch/:userId/:zapId', async (req, res) => 
{
    const zapId = req.params.zapId;
    const body = req.body;

        await client.$transaction(async tx => 
        {
            const run = await tx.zapRun.create({
                data: {
                    zapId: zapId,
                    metadata: body
                }
            })

            await tx.zapRunOutbox.create({
                data: 
                {
                    zapRunId: run.id,
                }
            })

            res.json({
            message: "Webhook is running"
            })
        }
    )
})

const port = 3002;
app.listen(port, () => 
{
    console.log(`server is running at http://localhost:${port}`);
});

//825f24a0-ef28-4db0-abab-49cf6a1d516a
// avaiabletriggerid-4e7b4b61-de80-44f1-951e-f25d45bf0825
