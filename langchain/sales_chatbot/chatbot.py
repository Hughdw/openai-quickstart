import gradio as gr
import random
import time

from typing import List
from enum import Enum, unique, auto

from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI


# Scene = Enum("Scene", ["房产", "电器", "家装", "教育"])
@unique
class Scene_enum(Enum):
    房产 = "real_estate"
    iPhone = "iphone"
    英语培训 = "english_training"


def test1(a, b):
    print(a)
    print(b)


def initialize_sales_bot(vector_store_dir: str = "real_estate_sales"):
    db = FAISS.load_local(vector_store_dir, OpenAIEmbeddings())
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)

    global SALES_BOT
    SALES_BOT = RetrievalQA.from_chain_type(
        llm,
        retriever=db.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={"score_threshold": 0.8},
        ),
    )
    # 返回向量数据库的检索结果
    SALES_BOT.return_source_documents = True
    # SALES_BOT.callbacks = [test1]

    return SALES_BOT


def add_text(history, text):
    # print(f"add_text-[history]{history}")
    # print(f"add_text-[text]{text}")

    history = history + [(text, None)]
    return history, gr.update(value="", interactive=False)


def bot(history, text):
    # print(f"bot-[history]{history}")
    # print(f"bot-[text]{text}")
    query = history[-1][0]

    enable_chat = False

    ans = SALES_BOT({"query": query})

    response = "这个问题我要问问领导"
    if ans["source_documents"] or enable_chat:
        print(f"[result]{ans['result']}")
        print(f"[source_documents]{ans['source_documents']}")
        response = ans["result"]

    history[-1][1] = ""
    for character in response:
        history[-1][1] += character
        time.sleep(0.05)
        yield history


def change_scene(choice):
    # print(f"change_scene-[choice]{choice}")
    vector_store_dir = choice + "_sales"
    initialize_sales_bot(vector_store_dir)
    return gr.Chatbot.update(value="")


def launch_gradio_by_blocks():
    with gr.Blocks(title="销售机器人") as blocks:
        with gr.Row():
            with gr.Column(scale=1):
                scene_radio = gr.Radio(
                    [(member.name, member.value) for member in Scene_enum],
                    label="切换场景",
                    info="选择一个要咨询的场景?",
                    value=Scene_enum.房产,
                )
            with gr.Column(scale=4):
                chatbot = gr.Chatbot([], elem_id="chatbot", bubble_full_width=False)
                with gr.Row():
                    txt = gr.Textbox(
                        scale=4,
                        show_label=False,
                        placeholder=" 请输入你想咨询的问题",
                        container=False,
                    )
                    # btn = gr.Button("Submit")
        txt_msg = txt.submit(add_text, [chatbot, txt], [chatbot, txt], queue=True).then(
            bot, chatbot, chatbot
        )
        txt_msg.then(lambda: gr.update(interactive=True), None, [txt], queue=False)

        scene_radio.change(fn=change_scene, inputs=scene_radio, outputs=chatbot)

        # btn.click(add_text, [chatbot, txt], [chatbot, txt], queue=True).then(bot, chatbot,chatbot)

    blocks.queue(max_size=10)
    blocks.launch(share=True, server_name="0.0.0.0", server_port=7861)


if __name__ == "__main__":
    # 初始化房产销售机器人
    initialize_sales_bot()
    # 启动 Gradio 服务
    launch_gradio_by_blocks()
