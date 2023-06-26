from taxii2client.v21 import Server, ApiRoot
import sys, getopt, json
from flask import Flask, request

# app = Flask(__name__)

# @app.route('/taxiipy', methods = ['POST'])

# def get_taxii_objs():

    # data = request.get_json()
    # print(data)

    # ls = data['array']
    # result = sum(ls)

    # return json.dumps({"objects":objects})

#Initialize user input variables
url = ""
apiroot_name = ""
collection_id = ""
user = ""
password = ""

#Arguments
opts, args = getopt.getopt(sys.argv[1:],"hu:a:c:n:p:",["url=","apiroot=","collection=","username=","password="])
for opt, arg in opts:
    if opt in ("-h", "--help"):
        print ('stig-client.py -u <url> -a <apiroot name> -c <collection id> -n <username> -p <password>')
        sys.exit()
    elif opt in ("-u", "--url"):
        url = arg
    elif opt in ("-a", "--apiroot"):
        apiroot_name = arg
    elif opt in ("-c", "--collection"):
        collection_id = arg
    elif opt in ("-n", "--username"):
        user = arg
    elif opt in ("-p", "--password"):
        password = arg

# print(url)
# print(user)
# print(password)

err = ""
taxii_objs = []

# URL check
if url == "":
    err = "URL cannot be blank"

# Collection ID check
if collection_id != "":
    # One Api Root, one collection
    if apiroot_name != "":
        api_url = url + "/" + apiroot_name
        #print(api_url)
        api_root = ApiRoot(url=api_url, user=user, password=password)

        col = {}

        try:
            for collections in api_root.collections:
                col[collections.id] = collections 
        except:
            print('')

        collection = col[collection_id]
        #print(collection.get_objects())
    # All Api Roots, one collection
    else:
        server = Server(url, user=user, password=password)

        col = {}

        for api_root in server.api_roots:
            collections = api_root.collections
            try:
                for collection in collections:
                    col[collection.id] = collection
            except:
                #print('')
                continue

        user_col = col[collection_id]
        taxii_objs = user_col.get_objects()['objects']
        #print(taxii_objs) 

# One Api Root, all collections
elif apiroot_name != "":
    api_url = url + "/" + apiroot_name
    #print(api_url)
    api_root = ApiRoot(url=api_url, user=user, password=password)

    col = {}

    try:
        for collections in api_root.collections:
            if collections:
                for c in collections:
                    if c.can_read and len(c.get_objects()) > 0:
                        objs = c.get_objects()['objects']
                        taxii_objs += objs
    except:
        print('')

    #collection = col[collection_id]
    #print(collection.get_objects())

# All Api Roots, all collections
else:
    server = Server(url, user=user, password=password)
    api_roots = server.api_roots
    for a in api_roots:
        cols = a.collections
        if cols:
            for c in cols:
                if c.can_read and len(c.get_objects()) > 0:
                    objs = c.get_objects()['objects']
                    taxii_objs += objs
    #print(objs)


print(json.dumps(taxii_objs))

# with open('temp_stix_taxii.json', 'w', encoding='utf-8') as f:
#     json.dump(taxii_objs, f, ensure_ascii=False, indent=4)
# f.close()
print(err)

# if __name__ == "__main__":
#     app.run(port=4000)
