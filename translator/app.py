from flask import Flask, request, jsonify
import requests
from io import BytesIO
from PIL import Image
import pykakasi
kks = pykakasi.kakasi()
# will convert the image to text string
from manga_ocr import MangaOcr
mocr = MangaOcr()

# translates into preferred language
from googletrans import Translator
translator = Translator(service_urls=['translate.googleapis.com'])

app = Flask(__name__)

@app.route("/translate", methods=['POST'])
def hello_world():
    data = request.get_json()
    response = requests.get(data["image"]['imageUri'])
    sourceImage = Image.open(BytesIO(response.content))
    sourceWidth, sourceHeight = sourceImage.size
    sourceRatio = sourceWidth/sourceHeight

    targetWidth, targetHeight = data["image"]["width"]*2, data["image"]["height"]*2
    targetImage = Image.new("RGB", (targetWidth, targetHeight), (255, 255, 255))
    targetRatio = targetWidth/targetHeight

    marginWidth = marginHeight = 0
    if sourceRatio>targetRatio:
        resizeWidth = targetWidth
        resizeHeight = resizeWidth / sourceRatio
        resizeImage = sourceImage.resize((int(resizeWidth), int(resizeHeight)))
        marginHeight = (targetHeight - resizeHeight) / 2
        targetImage.paste(resizeImage, (0, int(marginHeight)))
    else:
        resizeHeight = targetHeight
        resizeWidth = resizeHeight * sourceRatio
        resizeImage = sourceImage.resize((int(resizeWidth), int(resizeHeight)))
        marginWidth = (targetWidth - resizeWidth) / 2
        targetImage.paste(resizeImage, (int(marginWidth), 0))

    croppedArea = data['croppedArea']
    croppedWidth, croppedHeight = croppedArea['width'], croppedArea['height']
    croppedLeft, croppedTop = croppedArea['left'], croppedArea['top']
    croppedRight, croppedBottom = croppedLeft+croppedWidth, croppedTop+croppedHeight
    croppedImage = targetImage.crop((int(croppedLeft*2), int(croppedTop*2), int(croppedRight*2), int(croppedBottom*2)))

    text = mocr(croppedImage)
    print('translating:', text)
    result = kks.convert(text)
    english = translator.translate(text)
    translatedEnglish = str(english.text)

    mandarin = translator.translate(text, dest='zh-cn')
    translatedMandarin = str(mandarin.text)

    return {
        'english':translatedEnglish,
        'mandarin':translatedMandarin,
        'original':result
    }

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)