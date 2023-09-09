from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS

scene = "english_training"

with open(scene + "_sales_data.txt") as f:
    sales_data = f.read()

text_splitter = CharacterTextSplitter(
    separator=r"\d+\.",
    chunk_size=100,
    chunk_overlap=0,
    length_function=len,
    is_separator_regex=True,
)

docs = text_splitter.create_documents([sales_data])


db = FAISS.from_documents(docs, OpenAIEmbeddings())
db.save_local(scene + "_sales")
